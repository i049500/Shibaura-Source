const currentYear = new Date().getFullYear();
const threeYearsAgo = currentYear - 3; // 3年前の年

function ActivitiesGetJSON(studyTbodyId, jobTbodyId, clubTbodyId) {

	const url = '/' + $.getQueryValue('uid') + '/Study/ActivitiesInfo/ActivitiesInfo.json';
	$.getJSON(url)
	.fail(function( xhr, textStatus, errorThrown) {
	})
	.done(function( data, textStatus, xhr) {
		//alldata = data;
		const studyData = data.study_info;
		const jobData = data.jobs_info;
		const clubData = data.club_info;

		 // 各データセットをフィルタリングおよび降順ソート
		const StudyData = SortRecentData(studyData);
		const JobData = SortRecentData(jobData);
		const ClubData = SortRecentData(clubData);

		const limitedData = combineAndLimitData(StudyData, ClubData, JobData, 10);

		// 最近3年いないのデータを動的作成
		const hasStudyData = createTableData(limitedData.studyData,studyTbodyId); // 留学情報
		const hasJobData = createTableData(limitedData.jobData,jobTbodyId); // アルバイト情報
		const hasClubData = createTableData(limitedData.clubData,clubTbodyId); // クラブ活動情報

		// 全体でデータがあるかどうかを確認
		const hasAnyData = hasStudyData || hasJobData || hasClubData;

		// データが一切ない場合はdivを非表示にする
		if (!hasAnyData) {
			document.getElementById("div_activitiesInfo").style.display = 'none';
		}

	});
}

// 降順にソートする関数
function SortRecentData(data) {
	return data
        .sort((a, b) => parseInt(b.Nendo) - parseInt(a.Nendo)); // 年度の降順でソート
}
function combineAndLimitData(studyData, clubData, jobData, limit) {
	console.log("Starting to combine and limit data...");
    const combinedData = {};
    const years = new Set();

    // 各データセットを処理
    [studyData, clubData, jobData].forEach(data => {
        data.forEach(item => {
            years.add(item.Nendo);  // 收集年份
            if (!combinedData[item.Nendo]) {
                combinedData[item.Nendo] = [];
            }
            combinedData[item.Nendo].push(item);  
        });
    });

    console.log("Combined data:", combinedData);

    // 将年份转换为数组并按降序排序
    const sortedYears = Array.from(years).sort((a, b) => b - a);
    const limitedData = { studyData: [], clubData: [], jobData: [] };// 制限付きデータ
    let count = 0;

    // 根据年份和数量限制输出数据
    for (const year of sortedYears) {
    	console.log(`Processing year: ${year}`);
        if (count >= limit) break;// 制限に達したら終了

        // 各年度からのデータをフィルタリング
        const studyYearData = studyData.filter(item => item.Nendo == year) || [];
        const clubYearData = clubData.filter(item => item.Nendo == year) || [];
        const jobYearData = jobData.filter(item => item.Nendo == year) || [];

        let remainingLimit = limit - count;

        if (studyYearData.length > 0) {
            const studyToAdd = studyYearData.slice(0, remainingLimit);
            limitedData.studyData.push(...studyToAdd);
            count += studyToAdd.length;
            console.log(`Added study data: ${studyToAdd.length}, Total count: ${count}, limit: ${limit},remainingLimit: ${remainingLimit}`);
        }

        if (count < limit && clubYearData.length > 0) {
            const clubToAdd = clubYearData.slice(0, limit - limitedData.studyData.length);
            limitedData.clubData.push(...clubToAdd);
            count += clubToAdd.length;
            console.log(`Added club data: ${clubToAdd.length}, Total count: ${count}, limit: ${limit},remainingLimit: ${remainingLimit}`);
        }

        if (count < limit && jobYearData.length > 0) {
            const jobToAdd = jobYearData.slice(0, limit - limitedData.studyData.length - limitedData.clubData.length);
            limitedData.jobData.push(...jobToAdd);
            count += jobToAdd.length;
            console.log(`Added job data: ${jobToAdd.length}, Total count: ${count}, limit: ${limit},remainingLimit: ${remainingLimit}`);
        }
    }


    console.log("Final limited data:", limitedData);
    return limitedData;
}

function createTableData(data, tbodyId){
    	const tbody = document.getElementById(tbodyId);

	    // データが存在確認フラグ
    	let hasData = false;

    	// tbodyの内容をクリア
        tbody.innerHTML = ''; 

		for(var i = 0; i<data.length; i++){
			if(data.length > 0){
				hasData = true;
			}
				const row = document.createElement("tr");
				const nendoCell = document.createElement("td");
				nendoCell.textContent = data[i].Nendo ; // 年度
				row.appendChild(nendoCell);

			if(tbodyId == "study-tbody"){ // 留学情報
				const totalDaysCell = document.createElement("td");
				totalDaysCell.textContent = data[i].TotalDays !== null ? data[i].TotalDays : " "; // 留学期間
				row.appendChild(totalDaysCell);

				const programNameCell = document.createElement("td");
				programNameCell.textContent = data[i].ProgramName !== null ? data[i].ProgramName : " "; // プログラム名
				row.appendChild(programNameCell);

			}else if(tbodyId == "club-tbody"){ // 部活動・サークル活動情報
				const dantaiNameCell = document.createElement("td");
				dantaiNameCell.textContent = data[i].DantaiName !== null ? data[i].DantaiName : " "; // 団体名
				row.appendChild(dantaiNameCell);

				const yakuinCell = document.createElement("td");
				yakuinCell.textContent = data[i].Yakuin !== null ? data[i].Yakuin : " "; // 役職
				row.appendChild(yakuinCell);
			}else if(tbodyId == "job-tbody"){ // 教育・研究補助業務（スチューデント・ジョブ制度）情報
				const jobPfCell = document.createElement("td");
				jobPfCell.textContent = data[i].JobPfName !== null ? data[i].JobPfName : " "; // 業務種別
				row.appendChild(jobPfCell);

				const workNaiyoCell = document.createElement("td");
				workNaiyoCell.textContent = data[i].WorkNaiyo !== null ? data[i].WorkNaiyo : " "; // 業務内容
				row.appendChild(workNaiyoCell);

			}
			// tbodyに行を追加
			tbody.appendChild(row);
	}

	// データが存在しない場合は親のテーブルを非表示に設定
	if (!hasData) {
		tbody.closest("table").style.display = 'none';
	}

	return hasData;

}

function generateTable($tbody,data,tabName){
	$tbody.empty(); // 既存の内容をクリア
	for(var i = 0; i<data.length; i++){
		const row = document.createElement("tr");
		const nendoCell = document.createElement("td");
			nendoCell.textContent = data[i].Nendo !== null ? data[i].Nendo : " "; // 年度
			row.append(nendoCell);

			if(tabName == "Study"){ // 留学情報
				const programFromCell = document.createElement("td");
				programFromCell.textContent = data[i].ProgramFrom !== null ? data[i].ProgramFrom : " "; // プログラム開始日
				row.append(programFromCell);

				const programToCell = document.createElement("td");
				programToCell.textContent = data[i].ProgramTo !== null ? data[i].ProgramTo : " "; // プログラム終了日
				row.append(programToCell);

				const totalDaysCell = document.createElement("td");
				totalDaysCell.textContent = data[i].TotalDays !== null ? data[i].TotalDays : " "; // 留学期間
				row.append(totalDaysCell);

				const countryNameCell = document.createElement("td");
				countryNameCell.textContent = data[i].CountryName !== null ? data[i].CountryName : " "; // 国名
				row.append(countryNameCell);

				const programNameCell = document.createElement("td");
				programNameCell.textContent = data[i].ProgramName !== null ? data[i].ProgramName : " "; // プログラム名
				row.append(programNameCell);

				const taCell = document.createElement("td");
				taCell.textContent = data[i].Ta !== null ? data[i].Ta : " " ; // TA参加
				row.append(taCell);

			}else if(tabName == "Club"){ // クラブ活動情報
				const dantaiNameCell = document.createElement("td");
				dantaiNameCell.textContent = data[i].DantaiName !== null ? data[i].DantaiName : " "; // 団体名
				row.append(dantaiNameCell);

				const katudoKbnNameCell = document.createElement("td");
				katudoKbnNameCell.textContent = data[i].KatudoKbnName !== null ? data[i].KatudoKbnName : " "; // 活動区分
				row.append(katudoKbnNameCell);

				const yakuinCell = document.createElement("td");
				yakuinCell.textContent = data[i].Yakuin !== null ? data[i].Yakuin : " "; // 役職
				row.append(yakuinCell);

			}else if(tabName == "Job"){ // アルバイト情報
				const periodFromCell = document.createElement("td");
				periodFromCell.textContent = data[i].PeriodFrom !== null ? data[i].PeriodFrom : " "; // 契約開始日
				row.append(periodFromCell);

				const periodToCell = document.createElement("td");
				periodToCell.textContent = data[i].PeriodTo !== null ? data[i].PeriodTo : " "; // 契約終了日
				row.append(periodToCell);

				const jobNameCell = document.createElement("td");
				jobNameCell.textContent = data[i].JobName !== null ? data[i].JobName : " "; // 業務名
				row.append(jobNameCell);

				const jobPfCell = document.createElement("td");
				jobPfCell.textContent = data[i].JobPfName !== null ? data[i].JobPfName : " "; // 業務種別
				row.append(jobPfCell);

				const workNaiyoCell = document.createElement("td");
				workNaiyoCell.textContent = data[i].WorkNaiyo !== null ? data[i].WorkNaiyo : " "; // 業務内容
				row.append(workNaiyoCell);
			}
			// tbodyに行を追加
			$tbody.append(row);
		}
}