$(function() { 
  let allData = [];
	const url = '/' + $.getQueryValue('uid') + '/Study/ScholarInfo/Gakuhi&Scholar.json';
	$.getJSON(url)
	.fail(function( xhr, textStatus, errorThrown) {
    console.error('JSONデータの読み込みに失敗しました:', errorThrown);
	})
	.done(function( data, textStatus, xhr) {
      allData = data;
      if(data.gakuhi_info && data.gakuhi_info.length >0){
        showScholarTableData('Gakuhi', data);
        $('#gakuhiSection').show();
      }

      if(data.scholar_info && data.scholar_info.length >0){
        showScholarTableData('Scholar', data);
        $('#scholarSection').show(); 
      }
      
    });
    
  // テーブルデータを表示する関数
  function showScholarTableData(tableName, data) {
    let tableData = [];

    switch (tableName) {
      case 'Gakuhi':
        tableData = data.gakuhi_info || []; // 学費
        break;
      case 'Scholar':
        tableData = data.scholar_info || []; // 奨学金
        break;

      default:
        console.warn('無効なデータ: ' + tableName);
        return;
    }

    tableData.sort(function(a,b){
      return parseInt(b.Nendo) - parseInt(a.Nendo);
    });

    // テーブルの tbody をクリア
    const $tbody = $('#' + tableName.toLowerCase() + 'Table tbody');
    generateScholarTable($tbody, tableData, tableName);
  }
});