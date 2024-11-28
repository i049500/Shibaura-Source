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

$.formatCurrency = function(amount) {
    return `${amount.toLocaleString()}`;
};

function generateScholarTable(containerId, sortedData) {

	const container = $(containerId);
    container.empty();
    const userLang = navigator.language || navigator.userLanguage;

    const translations = {
      ja: {
        header: "奨学金採用状況",
        headers: ["採用年度","採用期","奨学金種別","金額"]
      },
      en: {
        header: "Scholarship Award Status",
        headers: ["Award Year","Recruitment Period","Type of Scholarship","Amount"]
      }
    };

    const lang = userLang.startsWith("ja")? "ja":"en";
    const t = translations[lang];

    container.append(`<h3>${t.header}</h3>`);
    

                container.append(`
            <table  style="visibility: visible; width: 100%">
               <thead>
                      <tr>
                          ${t.headers.map(header => `<th>${header}</th>`).join("")}
                      </tr>
               </thead>
               <tbody>
                   ${sortedData.map(item => `
                    <tr>
                        <td>${item.Nendo}</td>
                        <td>${item.SaiyoKi}</td>
                        <td>${item.SyubetuName}</td>
                        <td>${(item.Kingaku || 0).toLocaleString("en-US")}</td>
                    </tr>
                `).join('')}
            </table>
              `);     
}

function groupDataByNendoAndKi(data) {
    const groupedData = {};
    data.forEach(item => {
        if (!groupedData[item.Nendo]) groupedData[item.Nendo] = {};
        if (!groupedData[item.Nendo][item.Ki]) groupedData[item.Nendo][item.Ki] = [];
        groupedData[item.Nendo][item.Ki].push(item);
    })
    return groupedData;
}

function generateTuitionTable(containerId, groupedData) {
    const container = $(containerId);
    container.empty();

    const userLang = navigator.language || navigator.userLanguage;

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
        headers: ["科目","学費データ作成日","請求額","納入日","納入額"]
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
        headers: ["Subject","Tuition Data Creation Date","Amount Billed","Payment Date","Amount Paid"]
      }
    };

    const lang = userLang.startsWith("ja")? "ja":"en";
    const t = translations[lang];

    container.append(`<h3>${t.header}</h3>`);
    // 全体を制御するボタンを追加
    container.append(`<button id="toggle-all">${t.toggleAllCollapse}</button>`);

    Object.keys(groupedData).sort((a, b) => b - a).forEach(nendo => {
        container.append(`<h4>${t.fiscalYear(nendo)}</h4>`);

        const kiData = groupedData[nendo];
        [1, 2].forEach(ki => {
            if (kiData[ki]) {
                const kiName = ki === 1 ?  t.term1 : t.term2;

                const seikyuTotal = kiData[ki].reduce((sum, item) => sum + item.SeikyuGaku, 0);

                const nonyuTotal = kiData[ki].reduce((sum, item) => sum + item.NonyuGaku, 0);

                const kiId = `${nendo}-${ki}`;

                container.append(`
            <div>
              <button class="toggle" data-target="${kiId}">-</button> ${kiName} ${t.billedTotal}: ${$.formatCurrency(seikyuTotal)} ${t.paidTotal}: ${$.formatCurrency(nonyuTotal)}
            </div>
            <table id = "${kiId}" style="visibility: visible; width: 100%">
               <thead>
                      <tr>
                          ${t.headers.map(header => `<th>${header}</th>`).join("")}
                      </tr>
               </thead>
               <tbody>
                   ${kiData[ki].map(item => `
                       <tr>
                           <td>${item.RyokinKanji}</td>
                           <td>${item.SeikyuYMD ? item.SeikyuYMD.replace(/^(\d{4})(\d{2})(\d{2})$/, '$1/$2/$3') : ''}</td>
                           <td>${(item.SeikyuGaku || 0).toLocaleString("en-US")}</td>
                           <td> ${item.NonyuYMD ? item.NonyuYMD.replace(/^(\d{4})(\d{2})(\d{2})$/, '$1/$2/$3') : ''}</td>
                           <td>${(item.NonyuGaku || 0).toLocaleString("en-US")}</td>
                       </tr>
                   `).join('')}
               </tbody>
            </table>
              `);
            }
        });
    });

    // 個別の展開/折りたたむ機能
    $('.toggle').on('click', function() {
        const targetId = $(this).data('target');
        const targetTable = $(`#${targetId}`);
        if (targetTable.is(':visible')) {
            targetTable.hide();
            $(this).text('+');
        } else {
            targetTable.show();
            $(this).text('-');
        }
    });

    // 全体の展開/折りたたみ機能
    $('#toggle-all').on('click', function() {
        const isExpand = $(this).text() === t.toggleAllExpand;
        if (isExpand) {
            // すべて展開
            $('.toggle').each(function() {
                const targetId = $(this).data('target');
                const targetTable = $(`#${targetId}`);
                targetTable.show();
                $(this).text('-');
            });
            $(this).text(t.toggleAllCollapse);
        } else {
            // すべて折りたたむ
            $('.toggle').each(function() {
                const targetId = $(this).data('target');
                const targetTable = $(`#${targetId}`);
                targetTable.hide();
                $(this).text('+');
            });
            $(this).text(t.toggleAllExpand);
        }
    });

}