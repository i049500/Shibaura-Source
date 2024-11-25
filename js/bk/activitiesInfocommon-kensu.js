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

		// 最近3年いないのデータを動的作成
		const hasStudyData = createTableData(studyData,studyTbodyId); // 留学情報
		const hasJobData = createTableData(jobData,jobTbodyId); // アルバイト情報
		const hasClubData = createTableData(clubData,clubTbodyId); // クラブ活動情報

		// 全体でデータがあるかどうかを確認
		const hasAnyData = hasStudyData || hasJobData || hasClubData;

		// データが一切ない場合はdivを非表示にする
		if (!hasAnyData) {
			document.getElementById("div_activitiesInfo").style.display = 'none';
		}
	});
}

function createTableData(data, tbodyId){
	const tbody = document.getElementById(tbodyId);
	tbody.innerHTML = '';

    // 件数行を作成して追加
	const countRow = document.createElement("tr");
	const countCell = document.createElement("td");
    countCell.colSpan = 3; // 列数
    countCell.textContent = `${data.length > 0 ? data.length : "0"}件`; // 件数を表示
    countCell.style.fontWeight = "bold";
    countRow.appendChild(countCell);
    tbody.appendChild(countRow); // 件数行を追加
    return data.length > 0;
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