function ScholarGetJSON(scholarTbodyId) {

    const url = '/' + $.getQueryValue('uid') + '/Study/ScholarInfo/Gakuhi&Scholar.json';
    $.getJSON(url)
        .fail(function(xhr, textStatus, errorThrown) {})
        .done(function(data, textStatus, xhr) {
            //alldata = data;
            const scholarData = data.scholar_info;
            const gakuhiData = data.gakuhi_info;

            const scholarCountElem = document.getElementById("scholar-count");
            scholarCountElem.textContent = `給付と貸与の合計件数：${scholarData.length}`;

            if (gakuhiData.length > 0) {
                // 各データセットをフィルタリングおよび降順ソート
                const sortedScholarData = SortScholarRecentData(scholarData);
                createScholarTableData(sortedScholarData, scholarTbodyId); // 奨学金状況
            } else {
                document.getElementById("div_scholar").style.display = 'none';
            }
        });
}

// 降順にソートする関数
function SortScholarRecentData(data) {
    return data
        .sort((a, b) => parseInt(b.Nendo) - parseInt(a.Nendo)); // 年度の降順でソート
}

function createScholarTableData(data, tbodyId) {
    const tbody = document.getElementById(tbodyId);

    // データが存在確認フラグ
    let hasData = false;

    // tbodyの内容をクリア
    tbody.innerHTML = '';

    if (data.length > 0) {
        for (var i = 0; i < data.length; i++) {
            if (data[i].TaiyoFlg == "0") {
                const row = document.createElement("tr");

                const nendoCell = document.createElement("td");
                nendoCell.textContent = data[i].Nendo; // 年度
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
}

function generateScholarTable($tbody, data, tabName) {
    $tbody.empty(); // 既存の内容をクリア
    for (var i = 0; i < data.length; i++) {
        const row = document.createElement("tr");
        /*if (tabName == "Gakuhi") { // 学費
            const kamokuCell = document.createElement("td");
            if (data[i].RyokinCd == "999") {
                kamokuCell.textContent = data[i].Nendo + (data[i].Ki === "1" ? "前" : "後") + data[i].RyokinKanji;
                row.style.fontWeight = "bold";
                row.style.backgroundColor = "#f2f2f2";
            } else {
                kamokuCell.textContent = data[i].RyokinKanji;
            }
            row.append(kamokuCell);

            const seikyuYMDCell = document.createElement("td");
            if (data[i].SeikyuYMD) {
                let seikyuYMD = data[i].SeikyuYMD.replace(/(\d{4})(\d{2})(\d{2})/, "$1/$2/$3"); // 請求日
                seikyuYMDCell.textContent = seikyuYMD;
            } else {
                seikyuYMDCell.textContent = "";
            }
            row.append(seikyuYMDCell);

            const seikyuGakuCell = document.createElement("td");
            seikyuGakuCell.textContent = data[i].SeikyuGaku === 0 ? "0" : data[i].SeikyuGaku.toLocaleString("en-US"); // 請求額
            row.append(seikyuGakuCell);

            const nonyuYMDCell = document.createElement("td");
            if (data[i].NonyuYMD) {
                let nonyuYMD = data[i].NonyuYMD.replace(/(\d{4})(\d{2})(\d{2})/, "$1/$2/$3"); // 納入日
                nonyuYMDCell.textContent = nonyuYMD;
            } else {
                nonyuYMDCell.textContent = "";
            }
            row.append(nonyuYMDCell);

            const nonyuGakuCell = document.createElement("td");
            nonyuGakuCell.textContent = data[i].NonyuGaku === 0 ? "0" : data[i].NonyuGaku.toLocaleString("en-US"); // 納入額
            row.append(nonyuGakuCell);

        } else */
        if (tabName == "Scholar") { // 奨学金
            const nendoCell = document.createElement("td");
            nendoCell.textContent = data[i].Nendo !== null ? data[i].Nendo : " "; // 年度
            row.append(nendoCell);

            const saiyoKiCell = document.createElement("td");
            saiyoKiCell.textContent = data[i].SaiyoKi !== null ? data[i].SaiyoKi : " "; // 採用期
            row.append(saiyoKiCell);

            const syubetuNameCell = document.createElement("td");
            syubetuNameCell.textContent = data[i].SyubetuName !== null ? data[i].SyubetuName : " "; // 奨学金種別
            row.append(syubetuNameCell);

            //const taiyoNameCell = document.createElement("td");
            //taiyoNameCell.textContent = data[i].TaiyoName !== null ? data[i].TaiyoName : " "; // 貸与/給付
            //row.append(taiyoNameCell);

            const kingakuCell = document.createElement("td");
            kingakuCell.textContent = data[i].Kingaku === 0 ? "0" : data[i].Kingaku.toLocaleString("en-US"); // 金額
            row.append(kingakuCell);

        }
        // tbodyに行を追加
        $tbody.append(row);
    }
}