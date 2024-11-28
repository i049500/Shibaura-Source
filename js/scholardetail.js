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

                generateTuitionTable("#gakuhiSection", groupedData);
            } else {
                $('#gakuhiSection').html('<p>データがありません。</p>');
            }

            if (data.scholar_info && data.scholar_info.length > 0) {
                const sortedData = SortScholarRecentData(data.scholar_info);
                generateScholarTable("#scholarSection", sortedData);
            }else{

            }

        });
});

