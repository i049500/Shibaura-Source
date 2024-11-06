var endPRG = false;

$(function() {
  var pm = new Personal();
  pm.load(function() {  
    var pd = new ProgressDialog(0,22,0,'progress');
    $('div#progress').find('div.modal-footer').hide();

    var idx = 0;

    var iid = setInterval(function() {
      var res = prepare(pd,++idx);
      pd.addValue();
      if (res == 1) {
	clearInterval(iid);

	if (getRemoteUser() == 'GW') {
	  var b = Personal.get('BuCD');
	  // 出欠席を移動
	  if (b == '1' || b == '2' || b == '3' || b == '4')
	    // 学部
	    $('div#div_attend_time').insertBefore($("div#div-prog-cont"));
	  else {
	    // 大学院
	    var gwa = $("div#div_gw_attend")
	    $('div#div_attend').insertBefore(gwa);
	    gwa.remove();
	  }
	}

	$('div#title').fadeOut(150,function() {
	  $('div.body').fadeIn(150);
	  showShortcut();
	  $('ul.link').removeClass('hidden');
	});

	endPRG = true;
      }
    },Just.isSafari()?250:100);

    pd.button('Cancel').on('click',function() {
      clearInterval(iid);
      endPRG = true;
    });
  });

  if (getRemoteUser() == 'GW') {
    // 授業外学修時間を削除
    $('div#div_time').remove();
  }
});

// クリックハンドラインストール
$(function() {
  var iid = setInterval(function() {
    if (!endPRG)
      return;

    clearInterval(iid);

    var uid = $.getQueryValue('uid');

    $('a.btn').on('click',function() {
      var jq = $(this);
      if (jq.hasClass('study'))
	self.location.href = './study.html?uid=' + uid + '&type=study,gpa';
      if (jq.hasClass('gpa'))
	self.location.href = './study.html?uid=' + uid + '&type=gpa,gpaavg';
      if (jq.hasClass('toeic'))
	self.location.href = './toeic.html?uid=' + uid;
      if (jq.hasClass('toeicticket'))
	self.location.href = './toeicticket.html?uid=' + uid;
      if (jq.hasClass('prog'))
	self.location.href = './prog.html?uid=' + uid;
      if (jq.hasClass('attend'))
	self.location.href = './attends.html?uid=' + uid;
      if (jq.hasClass('cefr'))
	self.location.href = './cefr.html?uid=' + uid;
      if (jq.hasClass('studyTime')) {
        if (getVersion() == "Teachers" || getVersion() == "Workers") {
	  if (Just.isChrome()) 
	    self.location.href = 'https://dashboard.sic.shibaura-it.ac.jp/index_2.html?uid='+$.getQueryValue('uid');
	  else
	    Dialog.alert(msgs.get('error'),msgs.get('INDEX_USE_CHROME'),Dialog.ERROR); 
        }
	else
	  self.location.href = './activities.html?d=t&uid=' + uid;
      }
      if (jq.hasClass('studyTimeWT'))
	self.location.href = 'https://dashboard.sic.shibaura-it.ac.jp/index_2.html?uid=' + uid;
      if (jq.hasClass('rank'))
	self.location.href = './rank.html?uid=' + uid + '&type=rank';
      if (jq.hasClass('venq'))
	self.location.href = './venq.html?uid=' + uid;
      if (jq.hasClass('rf'))
	self.location.href = './reflection.html?uid=' + uid;
      if (jq.hasClass('rplan'))
	self.location.href = './rplan.html?uid=' + uid;
//okuda start
      if (jq.hasClass('results'))
	self.location.href = './results.html?uid=' + uid;
//okuda end
//okuda1 start
      if (jq.hasClass('fukucourse'))
	self.location.href = './fukucourse.html?uid=' + uid;
//okuda1 end
//2024.9.30 zhou add start
     if (jq.hasClass('activitiesInfo'))
  self.location.href = './activitiesInfo.html?uid=' + uid;
//2024.9.30 zhou add end
      //2024/5/16 武内 全課程確認ボタン start
      bcd = Personal.get('BuCD');
      if (jq.hasClass('preinfocheck') && bcd == '5')
      self.location.href = './index.html?uid=' + uid + '_1';  

      if (jq.hasClass('preinfocheck') && bcd == '6')
      self.location.href = './index.html?uid=' + uid + '_2';
      //2024/5/16 武内 全課程確認ボタン end
    });

    $('div.studyTime').find('div').each(function() {
      $(this).removeClass('well').removeClass('container');
    });
  },100);
});  

// ショットカットスクロールと表示関数
$(function () {
  var headerHight = 60;
  var a = 'div nav ul.link a';//'div.tab ul li a';
  $(a).click(function(){
    var href= $(this).attr("href");
    var target = $('div#div_' + href.substring(1));
    var position = target.offset().top-headerHight;
    $("html, body").animate({scrollTop:position}, 250, "swing");
      return false;
  });

  window.showShortcut = function() {
    $(a).each(function() {
      var jq = $(this);
      var href= jq.attr("href");
      var trg = $('div#div_' + href.substring(1));
      if (!trg.length || !trg.is(':visible'))
	jq.addClass('hidden');
   });
  };    
});

function prepare(pd,idx)
{
  var bcd; // on 13,14
  switch (idx) {
  default:
    return 1;

  case 1:
    pd.setMessage(msgs.get('INDEX_LOADING_LEARNIG_HISTORY'));
    break;

  case 2:
    StudyDataset(new dataset(),function(ds){
      //ds.getXAxis().display = false;
      draw(ds,null,{id: 'studyCanvas',next: function() {
        if (ds.creditsTotal && ds.creditsTotal.length)
          $('div.creditsTotal').html('<span class="label label-default">' + msgs.get('total_credits') + '</span>　' + ds.creditsTotal[ds.creditsTotal.length-1]);
      }});
    },
    {nodialog: true,noevent: true,xslParam: {bShortLabel: true}}
    );
    break;

  case 3:
    pd.setMessage(msgs.get('INDEX_LOADING_GPA'));
    break;

  case 4:
    GPADataset(new dataset(),function(ds){
      //ds.getXAxis().display = false;
      if (ds.totalGPA.length) {
        for (var idx = 0;idx<ds.totalGPA.length;++idx)
	  if (ds.totalGPA[idx] > 0)
	    break;
	if (idx < ds.totalGPA.length) {
 	  var tgpa = ds.getParameter('totalGPA');
	  if (!ds.totalGPA[0])
	    tgpa.label = tgpa.label + ' (' + ds.totalGPA[idx] + ')';
	}
      }

      draw(ds,null,{id: 'GPACanvas',next: function() {
        if (ds.GPA && ds.GPA.length)
	  $('div.recentGPA').html('<span class="label label-default">' + msgs.get('recent_gpa') + '</span>　' + ds.GPA[ds.GPA.length-1]);      
      }});
    },
    {nodialog: true,noevent: true,xslParam: {bShortLabel: true}});
    break;

  case 5:
    pd.setMessage(msgs.get('INDEX_LOADING_TOEIC'));
    bcd = Personal.get('BuCD');
    if (bcd == '5' || bcd == '6') {	
      $('div#div_toeic_din').html($('div#div_toeic_gbu').html()).closest('div.din').removeClass('hidden');
      $('div#div_toeic_gbu').html(' ');
      $('.din-hidden').addClass('hidden');
      $('a#tab_toeic').attr('href','#toeic_din');      
    }
    //2024/5/16 武内 学部表示分け start
    if (bcd == '1') {
      $('.abu-hidden').addClass('hidden');
      $('.gbu-hidden').addClass('hidden');
    }

    if (bcd == '2') {
      $('.dbu-hidden').addClass('hidden');
      $('.gbu-hidden').addClass('hidden');
    }

    if (bcd == '3') {
      $('.bbu-hidden').addClass('hidden');
      $('.gbu-hidden').addClass('hidden');
    }

    if (bcd == '4'){
      $('.cbu-hidden').addClass('hidden');
      $('.gbu-hidden').addClass('hidden');
    }
    //2024/5/16 武内 学部表示分け end

    //else $('.gbu-hidden').addClass('hidden');

    break;

  case 6:
    TOEICDataset(new dataset(),function(ds){
      //ds.getXAxis().display = false;
      draw(ds,null,{id: 'toeicCanvas',next: function() {
      	if (ds.maxT)
          $('div.toeicMax').html('<span class="label label-default">' + msgs.get('hi_score') + '</span>　' + ds.maxT);
      }});
    },
    {nodialog: true,noevent: true,xAxisX: 50,xslParam: {bShortLabel: true}});
    break;

  case 7:
    pd.setMessage(msgs.get('INDEX_LOADING_CEFR'));
    break;

  case 8:
    {
      var uid = $.getQueryValue('uid');

      just.restAndTransform('/' + uid + '/Study/FLE.xml',
      			    './xsl/index/cefr.xslp',
			    {nodialog: true,noevent: true})
      .done(function(frag) {
        var d = $('div.cefr');
	var l = d.html(frag).find('table.cefr').attr('cefr_level');
	if (l != '')
	  $('div#cefr_level').html(
	  '<div class="row cefr_level">' +
	    '<div class="col-xs-12"><span class="label label-default">CEFR</span></div>' +
	    '<div class="col-xs-12"><br/></div>' +
	    '<div class="col-xs-12">Level <span class="label label-primary">' + l + '</span></div>' +
	  '</div>');
	else
	  $('div#cefr_level').html(
	  '<div class="row cefr_level">' +
	    '<div class="col-xs-12"><span class="label label-default">CEFR</span></div>' +
	    '<div class="col-xs-12"><br/></div>' +
	    '<div class="col-xs-12">Level <span class="label label-danger">NO SCORE</span></div>' +
	  '</div>');

      })
      .fail(function(textstatus,err,rest,status,type) {
        if (type == Just.ERR_REST && status == 404)
          return {altResponse: $.parseXML('<notfound/>')};
      });
    }
    break;
    
  case 9:
    pd.setMessage(msgs.get('INDEX_LOADING_ATTENDANCE'));
    break;

  case 10:
    if (!AttendDataset(new dataset(),function(ds){
        //ds.getXAxis().display = false;
        draw(ds,null,{id: 'attendCanvas',next: function() {
      	  if (ds.totalAttends || ds.totalLates || ds.totalAbsents)
            $('div.attendSummary').html('<span class="label label-default">' + msgs.get('attend_average') + '</span>　' + Math.round(100.0 * ((ds.totalAttends + ds.totalLates)*1.0/(ds.totalAttends + ds.totalLates + ds.totalAbsents)*1.0)) + ' %');
        }})
      },
      {nodialog: true,noevent: true,bShortLabel: true})) {
      $('div.attendSummary').html('<div class="alert alert-warning"><img src="image/dialog/warn.png"/>' + msgs.get('INDEX_NO_ATTENDANCE') + '</div>')
    }
    break;

  case 11:
    pd.setMessage(msgs.get('INDEX_LOADING_PROG'));
    break;

  case 12:
    if (Personal.get('GakkaCD') == 'M00') {
      $('div#div-prog-cont').addClass('hidden');
      break;
    }
    PROGDataset(new dataset(),function(ds){
      drawPROG(ds);
      {
	if (ds.literacy.Y1 || ds.literacy.Y3) {
	  var l = ds.literacy.Y3?ds.literacy.Y3:ds.literacy.Y1;
	  var c = ds.competency.Y3?ds.competency.Y3:ds.competency.Y1;
	  var s = ds.literacy.Y3?3:1;
	  $('div.lt_total').html(
	  '<row>'+
	    '<div class="col-xs-12"><span class="label label-default">Literacy</span></div>' +
	    '<div class="col-xs-12 center">Level</div>' +
	    '<div class="col-xs-12 center"><span class="badge">' + l + '</span></div></row>');
	  $('div.cp_total').html(
	  '<row>'+
	    '<div class="col-xs-12"><span class="label label-default">Competency</span></div>' +
	    '<div class="col-xs-12">Level</div>' +
	    '<div class="col-xs-12"><span class="badge">' + c + '</span></div></row>');
	}
      }
    },
    {nodialog: true,noevent: true});
    break;

  case 13:
    bcd = Personal.get('BuCD');
    if (bcd == '1' || bcd == '2' || bcd == '3' || bcd == '4') {	
      pd.setMessage(msgs.get('INDEX_LOADING_RANK'));
    }
    else {
      $('div.college').hide().removeClass('body');
    }
    break;

  case 14:
    bcd = Personal.get('BuCD');
    if (!(bcd == '1' || bcd == '2' || bcd == '3' || bcd == '4'))
      break;
    else if (Personal.get('GakkaCD') == 'M00')
      $('div#div_rank').addClass('hidden');
    RankDataset(new dataset(),function(ds){
      var N;
      if (ds && ds.passedRank && ds.passedRank.length) {      
        $('div#rank').html(
	  '<h3>' + msgs.get('INDEX_LATEST_RANKING') + '（' + ds.labels[ds.labels.length-1] +'）</h3>' +
  	  '<div class="row cefr_level">' +
	    '<div class="col-xs-6"><span class="label label-default">' + msgs.get('INDEX_SCORE_AVERAGE_RANKING') + '</span></div>' +
	    '<div class="col-xs-6"><span class="label label-default">' + msgs.get('INDEX_TOTAL_SCORE_AVERAGE_RANKING') + '</span></div>' +
	  '</div>'+
  	  '<div class="row cefr_level">' +
	    '<div class="col-xs-6"><br/></div>' +
	    '<div class="col-xs-6"><br/></div>' +
	  '</div>'+
  	  '<div class="row cefr_level">' +
	    '<div class="col-xs-6"><span class="label label-primary">' + ds.getPassedRank(ds.passedRank.length-1) + '/' + (N = ds.N[ds.N.length-1]) + msgs.get('rank_suffix') + '</span></div>' +
	    '<div class="col-xs-6"><span class="label label-success">' + ds.getTotalRank(ds.totalRank.length-1) + '/' + (N) + msgs.get('rank_suffix') + '</span></div>' +
	  '</div>' +
	  (ds.lastModified?'<h4><div class="right">（' + ds.lastModified + msgs.get('now') + '）</div></h4>':''));
      }
      else {
	$('div#rank').html(
	  '<div class="alert alert-danger"><img src="./image/dialog/warn.png"/>' + msgs.get('INDEX_NOT_FOUND_RANKING_DATA') + '</div>'
	);
      }
      draw(ds,null,{id: 'RankCanvas',next: function() {}});
    },{nodialog: true,noevent: true,xslParam: {bShortLabel: true}});
    break;

  case 15:
    bcd = Personal.get('BuCD');
    if (bcd == '1' || bcd == '2' || bcd == '3' || bcd == '4') {	
      pd.setMessage(msgs.get('INDEX_LOADING_GOAL'));
    }
    else
      $('div#div_goal').remove();

    break;

  case 16:
    bcd = Personal.get('BuCD');
    if (bcd == '1' || bcd == '2' || bcd == '3' || bcd == '4') {
      var xml = just.get('/' + $.getQueryValue('uid') + '/Study/VEnquete.xml')
      .fail(function() {
        $('div#div_goal').remove();
      })
      .done(function(doc) {
        $(doc).find('ID').each(function(idx,elem) {
	  var ans;
	  if (elem.getAttribute('id').indexOf(getCurrentYear()) == 0 && (ans = elem.parentNode.getAttribute('answer4'))) {
	    $('div#goal').html(ans);
	  }	      
	});
      });
    }
    break;

  case 17:
    pd.setMessage(msgs.get('INDEX_LOADING_RF'));
    break;

  case 18:
    rf_index(fixvenq);
    break;
            
  case 19:
    process_deans('deans_btn','deans_menu');
    break;

  case 20:
    bcd = Personal.get('BuCD');
    if (bcd == '5' || bcd == '6')
      pd.setMessage(msgs.get('INDEX_LOADING_RP'));
    break;

  case 21:
    bcd = Personal.get('BuCD');
    if (bcd == '5' || bcd == '6')
      loadResearchPlan();
    break;
      
  }
}

function fixvenq()
{
  var venq = $('div#div_goal'); 
  var rf = $('div#div_rf');

  if (venq.length && rf.length) {
  }
  else if (venq.length)
    venq.removeClass('col-md-6 col-lg-6').addClass('col-md-12 col-lg-12');
  else if (rf.length) 
    rf.removeClass('col-md-6 col-lg-6').addClass('col-md-12 col-lg-12');
  else
    return;
  $('div#venq').removeClass('hidden');
}

function loadResearchPlan()
{
  var uid = $.getQueryValue('uid');

  $.getJSON('/' + uid + '/Study/ResearchPlan.json')
  .then(function(data) {
    showNowResearchPlan(data);        
  })
  .fail(function(xhr,status,throwed) {
    $('div#rplan').html('<div class="alert alert-danger">' + msgs.get(((xhr.status != 404)?'INDEX_RPLAN_ERROR':'INDEX_RPLAN_NOTFOUND'),[xhr.status]) + '</div>');
  });
}

function showNowResearchPlan(data)
{
  var b = parseInt(Personal.get('BuCD'));
  var y = parseInt(Personal.get('HaitouNen'));
  var zn = parseInt(Personal.get('ZaigakuNenji'));
  var sm = Personal.get('Semester');

  var j = (sm == 2)?2:1;
  var p = 1;

  var cy = getCurrentYear();
  var cj = getCurrentTerm();

  while (y != cy || j != cj) {
    if (b == '5' && p >= 4 || b == '6' && p >= 6)
      break;
    if (j == 2) {
      ++y;
      j=1;
    }
    else
      ++j;
    ++p;
  }

  $('div#rplan').html(data['plan'+p].replace(/\r\n/g,'<br/>').replace(/\n/g,'<br/>').replace(/\r/g,'<br/>'));  
}
