$(function() {
    let allData = [];
    const url = '/' + $.getQueryValue('uid') + '/Study/ActivitiesInfo/ActivitiesInfo.json';
    $.getJSON(url)
        .fail(function(xhr, textStatus, errorThrown) {
            console.error('JSONデータの読み込みに失敗しました:', errorThrown);
        })
        .done(function(data, textStatus, xhr) {
            allData = data;
            // 最初のタブ（留学情報）にデータを表示
            if (data.study_info && data.study_info.length > 0) {
                showTableData('Study', data);
                $('#studySection').show();
            }

            if (data.club_info && data.club_info.length > 0) {
                showTableData('Club', data);
                $('#clubSection').show();
            }

            if (data.jobs_info && data.jobs_info.length > 0) {
                showTableData('Job', data);
                $('#jobSection').show();
            }

        });

    /*// タブクリックイベントの設定
    $('.tablink').on('click', function(event) {
      event.preventDefault();
      const tabName = $(this).data('tab');

      // すべてのタブコンテンツを非表示にする
      $('.tabcontent').hide();

      // クリックしたタブに対応するコンテンツを表示
      $('#' + tabName).show();

      // タブデータを表示
      showTableData(tabName, allData);

      // タブのアクティブ状態を変更
      $('.nav-tabs li').removeClass('active');
      $(this).parent().addClass('active');
    });*/

    // テーブルデータを表示する関数
    function showTableData(tableName, data) {
        let tableData = [];

        switch (tableName) {
            case 'Study':
                tableData = data.study_info || []; // 留学情報
                break;
            case 'Club':
                tableData = data.club_info || []; // 部活動・サークル活動情報
                break;
            case 'Job':
                tableData = data.jobs_info || []; // 教育・研究補助業務活動情報（スチューデント・ジョブ制度）
                break;

            default:
                console.warn('無効なデータ: ' + tableName);
                return;
        }

        tableData.sort(function(a, b) {
            return parseInt(b.Nendo) - parseInt(a.Nendo);
        });

        // テーブルの tbody をクリア
        const $tbody = $('#' + tableName.toLowerCase() + 'Table tbody');
        generateTable($tbody, tableData, tableName);
    }
});