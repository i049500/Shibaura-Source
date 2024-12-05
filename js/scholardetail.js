$(function() {
    let allData = [];
    const url = '/' + $.getQueryValue('uid') + '/Study/ScholarInfo/Gakuhi&Scholar.json';
    $.getJSON(url)
        .fail(function(xhr, textStatus, errorThrown) {
            console.error('JSONデータの読み込みに失敗しました:', errorThrown);
        })
        .done(function(data, textStatus, xhr) {
            allData = data;

            const groupedData = groupDataByNendoAndKi(data.gakuhi_info);
            generateTuitionTable('gakuhiSection', groupedData);

            const sortedData = SortScholarRecentData(data.scholar_info);
            generateScholarTable('scholarSection', sortedData);
        });
});