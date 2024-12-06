const userLang_scholar = navigator.language || navigator.userLanguage; // ユーザーのブラウザの言語を取得

function ScholarGetJSON(containerId) {

    const url = '/' + $.getQueryValue('uid') + '/Study/ScholarInfo/Gakuhi&Scholar.json';
    $.getJSON(url)
        .fail(function(xhr, textStatus, errorThrown) {
            document.getElementById("div_scholar").style.display = 'none';
        })
        .done(function(data, textStatus, xhr) {
            //alldata = data;
            const scholarData = data.scholar_info;
            //const gakuhiData = data.gakuhi_info;

            //const validScholarData = scholarData.filter(item => item.TaiyoFlg === "0");
            const sortedScholarData = SortScholarRecentData(scholarData);
            createScholarTableData(sortedScholarData, containerId); // 奨学金状況
            /*} else {
                document.getElementById("div_scholar").style.display = 'none';
            }*/
        });
}

// 降順にソートする関数
function SortScholarRecentData(data) {
    return data
        .sort((a, b) => parseInt(b.Nendo) - parseInt(a.Nendo)); // 年度の降順でソート    
}

$.formatCurrency = function(amount) {
    return `${amount.toLocaleString()}`;
};

function createScholarTableData(sortedData, containerId) {
    const container = document.getElementById(containerId);

    // 日本語と英語の文言を格納
    const translations = {
        ja: {
            header: "奨学金採用状況（給付のみ）",
            headers: ["年度", "採用期", "奨学金種別"],
            noDataMessage: "奨学金の採用情報はありません",
            noGrantDataMessage: "給付型奨学金の採用情報はありません"
        },
        en: {
            header: "Scholarship Adoption Status (Grant Only)",
            headers: ["Year", "Recruitment Period", "Type of Scholarship"],
            noDataMessage: "No Scholarship Information",
            noGrantDataMessage: "No Information On Grant-type Scholarships"
        }
    };
    const lang = userLang_scholar.startsWith("ja") ? "ja" : "en"; // 言語が日本語の場合は"ja"、それ以外は"en"に設定
    const t = translations[lang]; // 選択された言語に基づいて翻訳を取得
    const taiyoFlgCount = sortedData.filter(item => item.TaiyoFlg === "0").length;

    let tableHtml = `<h3>${t.header}</h3>
            <table class = "scholar-table">
                <thead>
                    <tr>
                        ${t.headers.map((header,index) => {
                                if(header === t.headers[1] || header === t.headers[2]){
                                    return `<th style="text-align: left; padding-left: 10px">${header}</th>`;
                                }
                                return `<th>${header}</th>`;
                             }).join("")}
                    </tr>
                </thead>
                `;
    //データがない場合、"奨学金の採用情報はありません"メッセージを表示
    if (sortedData.length === 0) {
        // 全体データがない場合、"奨学金の採用情報はありません"のテーブルを作成
        tableHtml += `
                <tbody>
                    <tr>
                        <td colspan="3" style="text-align: center; color: red;"><b>${t.noDataMessage}</b></td>
                    </tr>
                </tbody>
        `;
        //return;
    } else if (taiyoFlgCount > 0) {
        //給付データがある場合、テーブル作成
        tableHtml += `
            <tbody>
                ${sortedData.filter(item => item.TaiyoFlg === "0").map(item => `
                    <tr>
                        <td>${item.Nendo}</td>
                        <td style="text-align: left; padding-left: 10px">${item.SaiyoKi}</td>
                        <td style="text-align: left; padding-left: 10px">${item.SyubetuName}</td>
                    </tr>
                `).join('')}
            </tbody>
    `;
    } else {
        // 給付データがない場合、"給付型奨学金の採用情報はありません"のテーブルを作成
        tableHtml += `
                <tbody>
                    <tr>
                        <td colspan="3" style="text-align: center; color: red;"><b>${t.noGrantDataMessage}</b></td>
                    </tr>
                </tbody>
        `;
        //return;
    }
    tableHtml += '</table>';
    container.innerHTML = tableHtml;
}

function generateScholarTable(containerId, sortedData) {
    const container = document.getElementById(containerId);

    // 日本語と英語の文言を格納
    const translations = {
        ja: {
            header: "奨学金採用状況",
            headers: ["採用年度", "採用期", "奨学金種別", "金額"],
            noDataMessage: "奨学金の採用情報はありません"
        },
        en: {
            header: "Scholarship Award Status",
            headers: ["Award Year", "Recruitment Period", "Type of Scholarship", "Amount"],
            noDataMessage: "No scholarship information found"
        }
    };
    const lang = userLang_scholar.startsWith("ja") ? "ja" : "en"; // 言語が日本語の場合は"ja"、それ以外は"en"に設定
    const t = translations[lang]; // 選択された言語に基づいて翻訳を取得

    let tableHtml = `<h3>${t.header}</h3>
            <table class = "scholar-table">
                <thead>
                    <tr>
                        ${t.headers.map((header,index) => {
                                if(header === t.headers[1] || header === t.headers[2]){
                                    return `<th style="text-align: left; padding-left: 10px">${header}</th>`;
                                }else if(header === t.headers[3]){
                                    return `<th style="text-align: right; padding-right: 10px">${header}</th>`;
                                }
                                return `<th>${header}</th>`;
                             }).join("")}
                    </tr>
                </thead>
                `;

    if (sortedData.length === 0) {
        tableHtml += `
               <tbody>
                   <td colspan="4" style="text-align: center; color: red;"><b>${t.noDataMessage}</b></td>
                </tbody>
              `;
    } else {
        tableHtml += `
               <tbody>
                   ${sortedData.map(item => `
                    <tr>
                        <td>${item.Nendo}</td>
                        <td style="text-align: left; padding-left: 10px">${item.SaiyoKi}</td>
                        <td style="text-align: left; padding-left: 10px">${item.SyubetuName}</td>
                        <td style="text-align: right; padding-right: 10px">${(item.Kingaku || 0).toLocaleString("en-US")}</td>
                    </tr>
                </tbody>
                `).join('')}
              `;
    }
    tableHtml += '</table>';
    container.innerHTML = tableHtml;
}

function groupDataByNendoAndKi(data) {
    const groupedData = {};
    data.forEach(item => {
        if (!groupedData[item.Nendo]) groupedData[item.Nendo] = {}; // もし年度のキーがない場合、新しいオブジェクトを作成
        if (!groupedData[item.Nendo][item.Ki]) groupedData[item.Nendo][item.Ki] = []; // もし期のキーがない場合、新しい配列を作成
        groupedData[item.Nendo][item.Ki].push(item); // 該当年度と期にアイテムを追加
    })
    return groupedData;
}

function generateTuitionTable(containerId, groupedData) {
    const container = document.getElementById(containerId);
    // 日本語と英語の文言を格納
    const translations = {
        ja: {
            header: "学費納入状況",
            toggleAllExpand: "すべて展開",
            toggleAllCollapse: "すべて折りたたむ",
            term1: "前期",
            term2: "後期",
            yearLabel: "年度",
            fiscalYear: (year) => `${year}年度`,
            billedTotal: "請求合計",
            paidTotal: "納入合計",
            headers: ["科目", "学費データ作成日", "請求額", "納入日", "納入額"]
        },
        en: {
            header: "Tuition Payment Status",
            toggleAllExpand: "Expand All",
            toggleAllCollapse: "Collapse All",
            term1: "Spring Semester",
            term2: "Fall Semester",
            yearLabel: "Fiscal Year",
            fiscalYear: (year) => `Fiscal Year ${year}`,
            billedTotal: "Total Billed",
            paidTotal: "Total Paid",
            headers: ["Subject", "Tuition Data Creation Date", "Amount Billed", "Payment Date", "Amount Paid"]
        }
    };
    const lang = userLang_scholar.startsWith("ja") ? "ja" : "en"; // 言語が日本語の場合は"ja"、それ以外は"en"に設定
    const t = translations[lang]; // 選択された言語に基づいて翻訳を取得

    container.innerHTML = `<h3>${t.header}</h3>`;
    // 全体を制御するボタンを追加
    container.innerHTML += `<button id="toggle-all">${t.toggleAllCollapse}</button>`;
    // groupedDataのキー（年度）を降順で並べ替え、各年度ごとにデータを表示
    Object.keys(groupedData).sort((a, b) => b - a).forEach(nendo => {
        // 各年度のタイトルを追加
        container.innerHTML += `<h4>${t.fiscalYear(nendo)}</h4>`;

        const kiData = groupedData[nendo];
        [1, 2].forEach(ki => {
            if (kiData[ki]) {
                // 期の名前（前期または後期）
                const kiName = ki === 1 ? t.term1 : t.term2;
                // 請求額の合計
                const seikyuTotal = kiData[ki].reduce((sum, item) => {
                    if (item.RyokinCd === '999') {
                        return item.SeikyuGaku || 0;
                    }
                    return sum;
                }, 0);
                // 納入額の合計
                const nonyuTotal = kiData[ki].reduce((sum, item) => {
                    if (item.RyokinCd === '999') {
                        return item.NonyuGaku || 0;
                    }
                    return sum;
                }, 0);

                const kiId = `${nendo}-${ki}`; // 期ごとのID（年度-期）
                // 各期のデータを表示
                container.innerHTML +=`
            <div>
              <button class="toggle" data-target="${kiId}">-</button> ${kiName} ${t.billedTotal}: ${$.formatCurrency(seikyuTotal)} ${t.paidTotal}: ${$.formatCurrency(nonyuTotal)}
            </div>
            <table id = "${kiId}" style="visibility: visible; width: 100%">
               <thead>
                      <tr>
                          ${t.headers.map((header,index) => {
                                if(header === t.headers[0]){
                                    return `<th style="text-align: left; padding-left: 10px">${header}</th>`;
                                }else if(header === t.headers[2] || header === t.headers[4] ){
                                    return `<th style="text-align: right; padding-right: 10px">${header}</th>`;
                                }
                                return `<th>${header}</th>`;
                             }).join("")}
                      </tr>
               </thead>
               <tbody>
                   ${kiData[ki].filter(item => item.RyokinCd !== '999').map(item => `
                       <tr>
                           <td style="text-align: left; padding-left: 10px">${item.RyokinKanji}</td>
                           <td>${item.SeikyuYMD ? item.SeikyuYMD.replace(/^(\d{4})(\d{2})(\d{2})$/, '$1/$2/$3') : ''}</td>
                           <td style="text-align: right; padding-right: 10px">${(item.SeikyuGaku || 0).toLocaleString("en-US")}</td>
                           <td> ${item.NonyuYMD ? item.NonyuYMD.replace(/^(\d{4})(\d{2})(\d{2})$/, '$1/$2/$3') : ''}</td>
                           <td style="text-align: right; padding-right: 10px">${(item.NonyuGaku || 0).toLocaleString("en-US")}</td>
                       </tr>
                   `).join('')}
               </tbody>
            </table>
              `;
            }
        });
    });

    // 個別の展開/折りたたむ機能
    $('.toggle').on('click', function() {
        const targetId = $(this).data('target'); // ボタンに紐づけられたターゲットIDを取得
        const targetTable = $(`#${targetId}`); // 対象となるテーブルを取得
        if (targetTable.is(':visible')) {
            targetTable.hide(); // すでに表示されていれば非表示に
            $(this).text('+'); // ボタンのテキストを「+」に変更
        } else {
            targetTable.show(); // 非表示であれば表示に
            $(this).text('-'); // ボタンのテキストを「-」に変更
        }
    });

    // 全体の展開/折りたたみ機能
    $('#toggle-all').on('click', function() {
        const isExpand = $(this).text() === t.toggleAllExpand; // 現在のボタンテキストが「すべて展開」かを判定
        if (isExpand) {
            // すべて展開
            $('.toggle').each(function() {
                const targetId = $(this).data('target');
                const targetTable = $(`#${targetId}`);
                targetTable.show(); // すべてのテーブルを表示
                $(this).text('-'); // ボタンテキストを「-」に変更
            });
            $(this).text(t.toggleAllCollapse); // ボタンテキストを「すべて折りたたむ」に変更
        } else {
            // すべて折りたたむ
            $('.toggle').each(function() {
                const targetId = $(this).data('target');
                const targetTable = $(`#${targetId}`);
                targetTable.hide(); // すべてのテーブルを非表示に
                $(this).text('+'); // ボタンテキストを「+」に変更
            });
            $(this).text(t.toggleAllExpand); // ボタンテキストを「すべて展開」に変更
        }
    });

}