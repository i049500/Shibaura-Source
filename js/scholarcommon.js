function ScholarGetJSON(scholarTbodyId) {

	const url = '/' + $.getQueryValue('uid') + '/Study/ScholarInfo/Gakuhi&Scholar.json';
	$.getJSON(url)
	.fail(function( xhr, textStatus, errorThrown) {
	})
	.done(function( data, textStatus, xhr) {
		//alldata = data;
		const scholarData = data.scholar_info;
	
		 // 各データセットをフィルタリングおよび降順ソート
		const sortedScholarData = SortRecentData(scholarData);

		// 最近3年いないのデータを動的作成
		const hasScholarData = createTableData(sortedScholarData,scholarTbodyId); // 留学情報

		// データが一切ない場合はdivを非表示にする
		if (!hasScholarData) {
			document.getElementById("div_activitiesInfo").style.display = 'none';
		}

	});
}

// 降順にソートする関数
function SortRecentData(data) {
	return data
        .sort((a, b) => parseInt(b.Nendo) - parseInt(a.Nendo)); // 年度の降順でソート
    }

    function createTableData(data, tbodyId){
    	const tbody = document.getElementById(tbodyId);

	    // データが存在確認フラグ
    	let hasData = false;

    	// tbodyの内容をクリア
        tbody.innerHTML = ''; 

        if(data.length>0){
        	for(var i = 0; i<data.length; i++){
        		if(data[i].TaiyoFlg == "0"){
        		const row = document.createElement("tr");

        		const nendoCell = document.createElement("td");
				nendoCell.textContent = data[i].Nendo ; // 年度
				row.appendChild(nendoCell);

				const saiyouKiCell = document.createElement("td");
				saiyouKiCell.textContent = data[i].SaiyoKi !== null ? data[i].SaiyoKi : " "; // 採用期
				row.appendChild(saiyouKiCell);

				const syubetuNameCell = document.createElement("td");
				syubetuNameCell.textContent = data[i].SyubetuName !== null ? data[i].SyubetuName : " "; // 奨学金種別
				row.appendChild(syubetuNameCell);

			    // tbodyに行を追加
				tbody.appendChild(row);
				hasData = true;
        		}
			}
		}
		
	// ３年以内データがないけど、全部データがあるの場合、データがありませんを表示
    if (!hasData) {
        const messageRow = document.createElement("tr");
        const messageCell = document.createElement("td");
        messageCell.colSpan = 3;
        messageCell.textContent = "奨学金採用なし";
        messageCell.style.color = "red";
        messageRow.appendChild(messageCell);
        tbody.appendChild(messageRow);
    }

	return hasData;

}