$(function() {
    let allData = [];
    const url = '/' + $.getQueryValue('uid') + '/Study/ActivitiesInfo/ActivitiesInfo.json';
    $.getJSON(url)
        .fail(function(xhr, textStatus, errorThrown) {
            console.error('JSONデータの読み込みに失敗しました:', errorThrown);
        })
        .done(function(data, textStatus, xhr) {

            // 各データセットをフィルタリングおよび降順ソート
            const sortedStudyData = SortRecentData(data.study_info);
            const sortedJobData = SortRecentData(data.jobs_info);
            const sortedClubData = SortRecentData(data.club_info);
            const distributedData = {
                study: sortedStudyData,
                job: sortedJobData,
                club: sortedClubData
            };
            generateTable(distributedData, 'activities-Section');
        });
});