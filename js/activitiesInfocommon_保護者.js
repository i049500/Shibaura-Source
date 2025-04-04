const userLang_activities = navigator.language || navigator.userLanguage; // ユーザーのブラウザの言語を取得

function ActivitiesGetJSON(containerId) {

    var e = $.getQueryValue("uid");
    (new Personal(e)).load(function(){
        var gakuban = Personal.get("GakusekiCD");
        const url = '/' + gakuban + '/Study/ActivitiesInfo/ActivitiesInfo.json';
    $.getJSON(url)
        .fail(function(xhr, textStatus, errorThrown) {
            document.getElementById("div_activitiesInfo").style.display = 'none';
        })
        .done(function(data, textStatus, xhr) {
            const studyData = data.study_info;
            const jobData = data.jobs_info;
            const clubData = data.club_info;

            // 各データセットをフィルタリングおよび降順ソート
            const sortedStudyData = SortRecentData(studyData);
            const sortedJobData = SortRecentData(jobData);
            const sortedClubData = SortRecentData(clubData);

            const totalCount = 10;
            const distributedData = distributeData(
                sortedStudyData,
                sortedJobData,
                sortedClubData,
                totalCount
            );

            // 最近3年いないのデータを動的作成
            const hasData = createTableData(distributedData, containerId); // 留学情報

            // データが一切ない場合はdivを非表示にする
            if (!hasData) {
                document.getElementById("div_activitiesInfo").style.display = 'none';
            }
        });
    });
}

function distributeData(studyData, jobData, clubData, totalCount) {
    const totalDatalength = studyData.length + jobData.length + clubData.length;

    const studyCount = Math.round(totalCount * (studyData.length / totalDatalength));
    const jobCount = Math.round(totalCount * (jobData.length / totalDatalength));
    const clubCount = totalCount - studyCount - jobCount;

    const distributedData = {
        study: studyData.slice(0, studyCount),
        job: jobData.slice(0, jobCount),
        club: clubData.slice(0, clubCount)
    };

    return distributedData;
}

// 降順にソートする関数
function SortRecentData(data) {
    return data
        .sort((a, b) => parseInt(b.Nendo) - parseInt(a.Nendo)); // 年度の降順でソート
}

function createTableData(distributedData, containerId) {
    const container = document.getElementById(containerId);
    // データが存在確認フラグ
    let hasData = false;

    // 日本語と英語の文言を格納
    const translations = {
        ja: {
            header: "直近10件",
            headers: {
                study: {
                    title1: ["留学情報"],
                    title2: ["年度", "留学期間", "プログラム名"]
                },
                club: {
                    title1: ["部活動・サークル活動情報"],
                    title2: ["年度", "団体名", "役職"]
                },
                job: {
                    title1: ["教育・研究補助業務情報（スチューデント・ジョブ制度）"],
                    title2: ["年度", "業務種別", "業務内容"]
                }
            }
        },
        en: {
            header: "The most recent 10 entries",
            headers: {
                study: {
                    title1: ["Study information"],
                    title2: ["Year", "TotalDays", "Program name"]
                },
                club: {
                    title1: ["Club and circle activity information"],
                    title2: ["Year", "Organization name", "Position"]
                },
                job: {
                    title1: ["Educational and research assistance job information (Student Job System)"],
                    title2: ["Year", "Job type", "Job description"]
                }
            }
        }
    };

    const lang = userLang_activities.startsWith("ja") ? "ja" : "en"; // 言語が日本語の場合は"ja"、それ以外は"en"に設定
    const t = translations[lang]; // 選択された言語に基づいて翻訳を取得

    container.innerHTML = `<h3>${t.header}</h3>`;

    const typeMap = {
        study: {
            data: distributedData.study,
            headerstitle: t.headers.study.title1,
            headers: t.headers.study.title2,
            rowTemplate: (item) => `
                <tr>
                    <td>${item.Nendo}</td>
                    <td style="text-align: left; left; padding-left: 10px">${item.TotalDays}</td>
                    <td style="text-align: left; left; padding-left: 10px">${item.ProgramName ? item.ProgramName : ''}</td>
                </tr>
            `
        },
        club: {
            data: distributedData.club,
            headerstitle: t.headers.club.title1,
            headers: t.headers.club.title2,
            rowTemplate: (item) => `
                <tr>
                    <td>${item.Nendo}</td>
                    <td style="text-align: left; left; padding-left: 10px">${item.DantaiName ? item.DantaiName : ''}</td>
                    <td style="text-align: left; left; padding-left: 10px">${item.Yakuin ? item.Yakuin : ''}</td>
                </tr>
            `
        },
        job: {
            data: distributedData.job,
            headerstitle: t.headers.job.title1,
            headers: t.headers.job.title2,
            rowTemplate: (item) => `
                <tr>
                    <td>${item.Nendo}</td>
                    <td style="text-align: left; left; padding-left: 10px">${item.JobPfName ? item.JobPfName : ''}</td>
                    <td style="text-align: left; left; padding-left: 10px">${item.WorkNaiyo ? item.WorkNaiyo : ''}</td>
                </tr>
            `
        }
    };
    //データがある場合、該当テーブル作成
    for (const [type, {data,headerstitle,headers,rowTemplate}] of Object.entries(typeMap)) {
        if (data.length > 0) {
            hasData = true;

            container.innerHTML += `
                <table class = "activities-table">
                    <thead>
                        <tr>
                            ${headerstitle.map(header => `<th colspan="3" style="font-size: 20px; text-align: left; left; padding-left: 10px">${header}</th>`).join("")}
                        </tr>
                        <tr>
                            ${headers.map((header,index) => {
                                if(type === 'study' && (header === t.headers.study.title2[1] || header === t.headers.study.title2[2])){
                                    return `<th style="text-align: left; padding-left: 10px">${header}</th>`;
                                }
                                if(type === 'club' && (header === t.headers.club.title2[1] || header === t.headers.club.title2[2])){
                                    return `<th style="text-align: left; left; padding-left: 10px">${header}</th>`;
                                }
                                if(type === 'job' && (header === t.headers.job.title2[1] || header === t.headers.job.title2[2])){
                                    return `<th style="text-align: left; left; padding-left: 10px">${header}</th>`;
                                }
                                return `<th>${header}</th>`;
                             }).join("")}
                        </tr>
                    </thead>
                    <tbody>
                        ${data.map(rowTemplate).join("")}
                    </tbody>
                </table>
            `;
        }
    }
    // データが存在しない場合は親のテーブルを非表示に設定
    /*if (!hasData) {
        tbody.closest("table").style.display = 'none';
    }*/
    return hasData;
}

function generateTable(sortedData, containerId) {
    const container = document.getElementById(containerId);

    // 日本語と英語の文言を格納
    const translations = {
        ja: {
            headers: {
                study: {
                    title1: ["留学情報"],
                    title2: ["年度", "プログラム開始日", "プログラム終了日", "留学期間", "国名", "プログラム名", "TA参加"]
                },
                club: {
                    title1: ["部活動・サークル活動情報"],
                    title2: ["年度", "団体名", "サークル名", "役職"]
                },
                job: {
                    title1: ["教育・研究補助業務情報（スチューデント・ジョブ制度）"],
                    title2: ["年度", "契約開始日", "契約終了日", "業務名", "業務種別", "業務内容"]
                }
            }
        },
        en: {
            headers: {
                study: {
                    title1: ["Study information"],
                    title2: ["Year", "Program start date", "Program end date", "TotalDays", "Country name", "Program name", "TA"]
                },
                club: {
                    title1: ["Club and circle activity information"],
                    title2: ["Year", "Organization name", "Club name", "Position"]
                },
                job: {
                    title1: ["Educational and research assistance job information (Student Job System)"],
                    title2: ["Year", "Contract start date", "Contract end date", "Job name", "Job type", "Job description"]
                }
            }
        }
    };

    const lang = userLang_activities.startsWith("ja") ? "ja" : "en"; // 言語が日本語の場合は"ja"、それ以外は"en"に設定
    const t = translations[lang]; // 選択された言語に基づいて翻訳を取得

    container.innerHTML = `<h3>${t.header}</h3>`;

    const typeMap = {
        study: {
            data: sortedData.study,
            headerstitle: t.headers.study.title1,
            headers: t.headers.study.title2,
            rowTemplate: (item) => `
                <tr>
                    <td>${item.Nendo}</td>
                    <td>${item.ProgramFrom ? item.ProgramFrom.replace(/^(\d{4})(\d{2})(\d{2})$/, '$1/$2/$3') : ''}</td>
                    <td>${item.ProgramTo ? item.ProgramTo.replace(/^(\d{4})(\d{2})(\d{2})$/, '$1/$2/$3') : ''}</td>
                    <td style="text-align: left; left; padding-left: 10px">${item.TotalDays}</td>
                    <td style="text-align: left; left; padding-left: 10px">${item.CountryName ? item.CountryName : ''}</td>
                    <td style="text-align: left; left; padding-left: 10px">${item.ProgramName ? item.ProgramName : ''}</td>
                    <td>${item.Ta ? item.Ta : ''}</td>
                </tr>
            `
        },
        club: {
            data: sortedData.club,
            headerstitle: t.headers.club.title1,
            headers: t.headers.club.title2,
            rowTemplate: (item) => `
                <tr>
                    <td>${item.Nendo}</td>
                    <td style="text-align: left; left; padding-left: 10px">${item.DantaiName ? item.DantaiName : ''}</td>
                    <td style="text-align: left; left; padding-left: 10px">${item.KatudoKbnName ? item.KatudoKbnName : ''}</td>
                    <td style="text-align: left; left; padding-left: 10px">${item.Yakuin ? item.Yakuin : ''}</td>
                </tr>
            `
        },
        job: {
            data: sortedData.job,
            headerstitle: t.headers.job.title1,
            headers: t.headers.job.title2,
            rowTemplate: (item) => `
                <tr>
                    <td>${item.Nendo}</td>
                    <td>${item.PeriodFrom ? item.PeriodFrom.replace(/^(\d{4})(\d{2})(\d{2})$/, '$1/$2/$3') : ''}</td>
                    <td>${item.PeriodTo ? item.PeriodTo.replace(/^(\d{4})(\d{2})(\d{2})$/, '$1/$2/$3') : ''}</td>
                    <td style="text-align: left; left; padding-left: 10px">${item.JobName ? item.JobName : ''}</td>
                    <td style="text-align: left; left; padding-left: 10px">${item.JobPfName ? item.JobPfName :''}</td>
                    <td style="text-align: left; left; padding-left: 10px">${item.WorkNaiyo ? item.WorkNaiyo : ''}</td>
                </tr>
            `
        }
    };
    container.innerHTML = '';
    for (const [type, {
            data,
            headerstitle,
            headers,
            rowTemplate
        }] of Object.entries(typeMap)) {
        if (data.length > 0) {
            container.innerHTML += `<h3>${headerstitle}</h3>`;

            container.innerHTML += `
                <table class = "activities-table">
                    <thead>
                        <tr>
                            ${headers.map((header,index) => {
                                if(type === 'study' && (header === t.headers.study.title2[3] || header === t.headers.study.title2[4] || header === t.headers.study.title2[5])){
                                    return `<th style="text-align: left; padding-left: 10px">${header}</th>`;
                                }
                                if(type === 'club' && (header === t.headers.club.title2[1] || header === t.headers.club.title2[2] || header === t.headers.club.title2[3])){
                                    return `<th style="text-align: left; left; padding-left: 10px">${header}</th>`;
                                }
                                if(type === 'job' && (header === t.headers.job.title2[3] || header === t.headers.job.title2[4] || header === t.headers.job.title2[5])){
                                    return `<th style="text-align: left; left; padding-left: 10px">${header}</th>`;
                                }
                                return `<th>${header}</th>`;
                             }).join("")}
                        </tr>
                    </thead>
                    <tbody>
                        ${data.map(rowTemplate).join("")}
                    </tbody>
                </table>
            `;
        }
    }
}