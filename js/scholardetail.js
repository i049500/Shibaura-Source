$(function() {
    let allData = [];
    const url = '/' + $.getQueryValue('uid') + '/Study/ScholarInfo/Gakuhi&Scholar.json';
    $.getJSON(url)
        .fail(function(xhr, textStatus, errorThrown) {
            console.error('JSONデータの読み込みに失敗しました:', errorThrown);
        })
        .done(function(data, textStatus, xhr) {
            allData = data;
            if (data.gakuhi_info && data.gakuhi_info.length > 0) {
                const groupedData = groupDataByNendoAndKi(data.gakuhi_info);

                renderTable("#gakuhiSection", groupedData);
            } else {
                $('#gakuhiSection').html('<p>データがありません。</p>');
            }

            if (data.scholar_info && data.scholar_info.length > 0) {
                showScholarTableData('Scholar', data);
                $('#scholarSection').show();
            }

        });
});

// テーブルデータを表示する関数
function showScholarTableData(tableName, data) {
    let tableData = [];

    tableData = data.scholar_info || []; // 奨学金

    tableData.sort(function(a, b) {
        return parseInt(b.Nendo) - parseInt(a.Nendo);
    });

    // テーブルの tbody をクリア
    const $tbody = $('#' + tableName.toLowerCase() + 'Table tbody');
    generateScholarTable($tbody, tableData, tableName);
}

$.formatCurrency = function(amount) {
    return `${amount.toLocaleString()}`;
};

function groupDataByNendoAndKi(data) {
    const groupedData = {};
    data.forEach(item => {
        if (!groupedData[item.Nendo]) groupedData[item.Nendo] = {};
        if (!groupedData[item.Nendo][item.Ki]) groupedData[item.Nendo][item.Ki] = [];
        groupedData[item.Nendo][item.Ki].push(item);
    })
    return groupedData;
}

function renderTable(containerId, groupedData) {
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
        headers: ["科目","請求日","請求額","納入日","納入額"]
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
        headers: ["Subject","Billing Date","Amount Billed","Payment Date","Amount Paid"]
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

    // 個別の展開/折りたたみ機能
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