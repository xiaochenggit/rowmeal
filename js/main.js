$(function(){
	// ---大厨的排餐报名
	// 点击其他区域隐藏列表
	$("body").click(function(event) {
		$(".input-group .foodlist").hide();
	});
	// 点击区域显示列表
	$(".input-group").click(function(event){
		$(".input-group .foodlist").hide();
		$(this).find('.foodlist').show();
		event.stopPropagation();
	});
	// ---大厨的排餐报名（完）

	// 二厨排菜

	// 添加配菜 删除配菜
	$(document).on('click','.food-list',function(event){
		var $parent = $(this).parent();
		var target = $(event.target);
		if (target.hasClass('fa-plus')) {
			target.parent().parent().append('<div class="food-list clearfix">'+target.parent().html()+"</div>");
			return false;
		} else if (target.hasClass('fa-minus')){
			target.parent().remove();
		} else {
			return false;
		}
	})
	// 二厨排菜完
	// 退出按钮点击
	$(".loginOut").click(function(event) {
		console.log('1');
		public.logout();
	});
	console.log(public.getUserCookie());
	// 登录
	$("#loadform").submit(function(event) {
		event.preventDefault();
		var mobile = $('#mobile').val();
		var password = $('#mobile').val();
		if (!mobile || !password) {
			alert("账号或密码不能为空");
			return;
		}
		if(!(/^1[34578]\d{9}$/.test(mobile))){ 
        	alert("手机号码有误，请重填"); 
        	return;
    	} 
		var formUrl = $(this).serialize();
		var URL = public.url + public.signin + '&' + formUrl;
		$.ajax({  
   			url: URL,   
   			type:'GET',
   			dataType:'json',
   			xhrFields : {
   				withCredentials :true
   			},  
	       success : function(result){ 
	       	console.log(result);
	       		if (result.code == 200) {
	       			public.returnUser();
	       		}
	       },  
	       error : function(msg) {  
	           console.log(msg);
	       }  
   		}); 
	});
});

// public

var public = {
	// 请求地址
	url : 'http://wxt.wapu.cn/schedule/index.php?r=',
	// 登录地址
	signin : 'api/doLogin',
	// 用户信息
	accountInfo : 'api/accountInfo',
	// 获取排餐日历 
	calendar : 'api/schedule', 
	// 退出登录
	doLogout : 'api/doLogout',
	// 创建排餐日历
	setcalendar : 'api/scheduleCreate',
	// 文化餐主菜
	BIZ_MAIN : 'api/dishList&type=BIZ_MAIN&keyword=&limit=',
	// 文化餐配菜
	BIZ_SIDE : 'api/dishList&type=BIZ_SIDE&keyword=&limit=',
	// 工作餐主菜
	JOB_MAIN : 'api/dishList&type=JOB_MAIN&keyword=&limit=',
	// 工作餐配菜
	JOB_SIDE : 'api/dishList&type=JOB_SIDE&keyword=&limit=',
	// 设置主菜
	setmain : 'api/setMain',
	// 设置配菜
	setside: 'api/setSide',
	// 删除主菜
	unsetmain : 'api/unsetMain',
	// 群主获得大厨信息
	cheflist : 'api/chefList&keyword=&limit=',
	// 禁止排餐
	setdisable: 'api/setDisable',
	// 允许排餐
	setenable : 'api/setEnable',

	// user cookie 储存名字
	cookieUserName : 'rowmeal',
	// 排餐开启时间
	startDay : '',
	// 排餐结束时间
	endDay : '',
	getDay : function (value){
	    var NewArray = new Array("周日","周一","周二","周三","周四","周五","周六");
	    KingVal = value;
	    DateYear = parseInt(KingVal.split("-")[0]);
	    DateMonth = parseInt(KingVal.split("-")[1]);
	    DateDay = parseInt(KingVal.split("-")[2]);
	    var NewDate = new Date(DateYear,DateMonth-1,DateDay);
	    var NewWeek = NewDate.getDay();
	    return (NewArray[NewWeek]);
    },
	// calendar 页面 根据返回数据渲染页面
	setcalendarHTML : function (data){
		// var data = { "code": 200, "msg": "", "rt": { "id": 0, "start": "2017-04-01", "end": "2017-04-02", "data": [ { "merchant": { "code": "BEJYD", "name": "远东店" }, "items": [ { "date": "2017-04-01", "dish": null, "status": 0 }, { "date": "2017-04-02", "dish": {}, "status": 1 } ] }, { "merchant": { "code": "BEJLK", "name": "临空店" }, "items": [ { "date": "2017-04-01", "dish": { "biz": { "main": { "id": 1, "name": "菜名", "cost": 1500, "chef": { "mobile": "13912345670", "name": "张三" } } } }, "status": 2 }, { "date": "2017-04-02", "dish": { "biz": { "main": { "id": 2, "name": "菜名", "cost": 1800, "chef": { "mobile": "13912345671", "name": "李四" } }, "side": [ { "id": 20, "name": "菜名" }, { "id": 21, "name": "菜名" } ] }, "job": { "main": { "id": 3, "name": "菜名", "cost": 1600, "chef": { "mobile": "13912345671", "name": "李四" } }, "side": [ { "id": 30, "name": "菜名" } ] } }, "status": 3 } ] } ] } };
		console.log(data);
		var data = data.rt;
		var cal = $('#cal');
		var title = '<div class="title">' + data.start + '~' + data.end + '</div>';
		
		var Arraydata = data.data;
		var bodyHTML = '';
		bodyHTML += '<div class="body clearfix">';
		bodyHTML += 	'<div class="shop">';
		bodyHTML +=      	'<ul>';
		bodyHTML +=				'<h2>店铺</h2>';	
		Arraydata.forEach(function (obj){
			bodyHTML +=	'<li data-code='+obj.merchant.code+'>'+obj.merchant.name+'</li>';
		})
		bodyHTML +=			'</ul>';
		bodyHTML +=      '</div>';
		bodyHTML += 	'<div class="weeks" id="week">';
		bodyHTML +=         '<ul>';
		bodyHTML +=             '<li class="weeklist clearfix">';
		Arraydata[0].items.forEach( function(item, index) {
			bodyHTML += 			'<p>';
			bodyHTML += 				'<span class="week">'+public.getDay(item.date)+'</span>';
			bodyHTML +=                 '<span class="num">'+(index+1)+'</span>';
			bodyHTML += 			'</p>';
		});
		bodyHTML +=				'</li>';
		Arraydata.forEach( function(item, index) {
			bodyHTML += 		'<li class="clearfix">';
			item.items.forEach( function(element, index) {
				
				// 没有排餐 根据权限显示不同内容
				if (!public.isEmptyObject(element.dish)) {
						var dish = JSON.stringify(element.dish);
						bodyHTML += 		'<p class="reAdd" status='+element.status+' item='+dish+' date='+element.date+' data-id='+data.id+' codeName='+item.merchant.name+' code='+item.merchant.code+'>';
						bodyHTML +=         	'<span>'+element.dish.biz.main.chef.name+'</span>';
						bodyHTML +=         	'<span>'+element.dish.biz.main.name+'</span>'
						bodyHTML += 		'</p>';
				} else {
					if(public.checkUsertype() == 1) {
						bodyHTML += 		'<p class="reAdd" status='+element.status+' item='+dish+' date='+element.date+' data-id='+data.id+' codeName='+item.merchant.name+' code='+item.merchant.code+'>';
						bodyHTML +=         	'<span>'+'暂无'+'</span>';
						bodyHTML +=         	'<span>'+'报名'+'</span>'
						bodyHTML += 		'</p>';
					} else {
						bodyHTML += 		'<p class="reAdd " status='+element.status+' item='+dish+' date='+element.date+' data-id='+data.id+' codeName='+item.merchant.name+' code='+item.merchant.code+'>';
						bodyHTML +=         	'<span>'+'点击'+'</span>';
						bodyHTML +=         	'<span>'+'报名'+'</span>'
						bodyHTML += 		'</p>';
					}
				}
			});
			bodyHTML += 		'</li>';
		});
		bodyHTML +=         '</ul>';
		bodyHTML +=     '</div>';
		bodyHTML += '</div>';
		cal.append(title);
		cal.append(bodyHTML);
		// 为群主添加确认排餐按钮
		if(public.checkUsertype() == 1) {
			var btn = '<div class="btn-group cal-btn-group"><button class="btn" id="sureCal">确认排餐</button></div>';
			cal.append(btn);
		}
		// 确认排餐按钮点击事件
		$("#sureCal").click(function (){
			public.sureCal();
		})
		// 点击排餐
		$(".reAdd").click(function(event) {
			var $this = $(this);
			var status = $this.attr("status");
			if (status == 0 && public.checkUsertype() != 1) {
				alert('暂未开启排餐');
				return false;
			}
			var date = $this.attr("date");
			var dataId = $this.attr("data-id");
			var code = $this.attr("code");
			var codeName = $this.attr("codeName");
			var item = $this.attr('item');
			console.log(date + '-' + dataId + '-' + code);
			if (public.checkUsertype() == 1) {
				window.location.href = '/masterLineup.html?' + 'status=' + status
				+ '&date=' + date + '&dataId=' + dataId + '&code=' + code + '&codeName=' + codeName + '&item=' + item;
			}
			else if (public.checkUsertype() == 2) {
				window.location.href = '/oneLineup.html?' + 'status=' + status
				+ '&date=' + date + '&dataId=' + dataId + '&code=' + code + '&codeName=' + codeName + '&item=' + item;
			} else {
				window.location.href = '/twoLineup.html?' +'status=' + status
				+ '&date=' + date + '&dataId=' + dataId + '&code=' + code + '&codeName=' + codeName + '&item=' + item;
			}
		});
		// 排餐日历 伸缩窗口
		function getWidth (){
			var width = Math.floor($("#week").width() / 5);
			var $p = $("#week p");  
			$("#week li").width($(".weeklist > p").length * width + 7);
			$p.width(width);
		}
		getWidth();
		window.onresize = function (){
			getWidth();
		}
	},
	sureCal: function (){
		var message = window.confirm('是否确认排餐');
		if (message) {
			console.log('确认排餐成功');
		} else {
			console.log('取消排餐成功');
		}
	},
	// 群主的排餐页面
	markerLineup : function (){
		var url = window.location;
		// 店名
		$('#shopName option').html(this.getUrlParam(url,'codeName'));
		// 日期
		$("#canData").val(this.getUrlParam(url,'date'));
		// 如果有数据
		if (this.getUrlParam(url,'item') != 'undefined') {
			var item = JSON.parse(this.getUrlParam(url,'item'));
			$("#name").append('<option value='+item.biz.main.chef.mobile+' >'+item.biz.main.chef.name+'</option>');
			$("#BIZ_MAIN .name").val(item.biz.main.name);
			$("#BIZ_MAIN .price").val(item.biz.main.cost/100 + '元');
			$("#JOB_MAIN .name").val(item.biz.main.name);
			$("#JOB_MAIN .price").val(item.biz.main.cost/100 + '元');
		}
		if (this.checkUsertype() == 1) {
			var user = this.getUserCookie();
			public.chefList(HTMLcherf);
			this.getCulture(HTMLCulture);
			this.getWork(HTMLWork);
			// 点击报名
			$("#oneBtn").click(function (event){
				event.preventDefault();
				public.mastercheckSetMain();
			})
			// 删除
			$("#deleteBtn").click(function(event) {
				event.preventDefault()
				public.checkUnsetmain();
			});
			// 返回
			$("#reBtn").click(function(event) {
				event.preventDefault();
				window.history.go(-1);
			});
			// 不排餐
			var status = this.getUrlParam(url,'status');
			if (status==0) {
				$("#noBtn").removeClass('noBtn').html('排餐');
			}
			$("#noBtn").click(function(event) {
				event.preventDefault();
				var url = window.location;
				var id = public.getUrlParam(url,'dataId');
				var mc = public.getUrlParam(url,'code');
				var date = public.getUrlParam(url,'date');
				var url = '&id='+id+'&mc='+mc+'&date='+date;
				if ($(this).hasClass('noBtn')) {
					public.unSetmain(url,function (){
						public.setDisable(url,function (){
							window.history.go(-1);
						});
					});
				} else {
					public.setEnable(url,function(){
						window.history.go(-1);
					});
				}
			});
			function HTMLcherf(data){
				var data = data.rt;
				data.forEach( function(item, index) {
					$("#name").append('<option value='+item.mobile+' >'+item.name+'</option>')
				});
				$("#name").click(function(event) {
					$('#mobile').val($(this).val());
				});
				$("#name").trigger('click');
			}
			function HTMLCulture(data){
				var ul = $('#culture ul');
				var liHTML = '';
				var ArrayData = data.rt;
				ArrayData.forEach( function(item, index) {
					liHTML += '<li data-id='+item.id+'>';
					liHTML += 	'<span class="foodName">'+item.name+'</span>';
					liHTML +=   '<span class="foodPrice">'+(item.cost/100)+'元'+'</span>';
					liHTML += '<li>';
				});
				ul.append(liHTML);
				shua();
			}
			function HTMLWork(data){
				var ul = $('#work ul');
				var liHTML = '';
				var ArrayData = data.rt;
				ArrayData.forEach( function(item, index) {
					liHTML += '<li data-id='+item.id+'>';
					liHTML += 	'<span class="foodName">'+item.name+'</span>';
					liHTML +=   '<span class="foodPrice">'+(item.cost/100)+'元'+'</span>';
					liHTML += '<li>';
				});
				ul.append(liHTML);
				// 输入菜名 更新列表
				shua();
			}
			function shua(){
				$('.input-group .name').keyup(function() {
						var $this = $(this);
						var $li = $(this).siblings('.foodlist').find("li");
						var reg = new RegExp($this.val())
						$li.each(function(index,el) {
							if (!reg.test($(this).find('.foodName').text())) {
								$(this).hide();
							} else {
								$(this).show();
							}
						});
				});
				// 点击列表 , 更新菜名和价格
				$(".input-group .foodlist li").each(function(index, el) {
					$(el).click(function(event){
						$this = $(this);
						$parent = $this.parent();
						$parent.parent().attr('data-id',$this.attr('data-id'));
						$parent.siblings('.name').val($this.find('.foodName').text());
						$parent.siblings('.price').val($this.find('.foodPrice').text());
						$parent.hide();
						return false;
					})
				});
			}
		}
	},
	//oneLineup 渲染大厨排餐页面
	oneLineup : function (){
		var url = window.location;
		// 店名
		$('#shopName option').html(this.getUrlParam(url,'codeName'));
		// 日期
		$("#canData").val(this.getUrlParam(url,'date'));
		var user = this.getUserCookie();
		$('#name').val(user.name);
		$('#mobile').val(user.mobile);
		// 如果有数据
		if (this.getUrlParam(url,'item') != 'undefined') {
			var item = JSON.parse(this.getUrlParam(url,'item'));
			console.log(item);
			if (item.biz) {
				$("#name").val(item.biz.main.chef.name);
				$("#mobile").val(item.biz.main.chef.mobile);
				$("#BIZ_MAIN .name").val(item.biz.main.name);
				$("#BIZ_MAIN .price").val(item.biz.main.cost/100 + '元');
			} 
			if (item.job) {
				console.log(item.job);
				$("#name").val(item.job.main.chef.name);
				$("#mobile").val(item.job.main.chef.mobile);
				$("#JOB_MAIN .name").val(item.job.main.name);
				$("#JOB_MAIN .price").val(item.job.main.cost/100 + '元');
			}
			
		}
		if (this.checkUsertype() == 2) {
			this.getCulture(HTMLCulture);
			this.getWork(HTMLWork);
			// 点击报名
			$("#oneBtn").click(function (event){
				event.preventDefault();
				public.checkSetMain();
			})
			$("#deleteBtn").click(function(event) {
				event.preventDefault()
				public.checkUnsetmain();
			});
			$("#reBtn").click(function(event) {
				event.preventDefault();
				window.history.go(-1);
			});
			function HTMLCulture(data){
				var ul = $('#culture ul');
				var liHTML = '';
				var ArrayData = data.rt;
				ArrayData.forEach( function(item, index) {
					liHTML += '<li data-id='+item.id+'>';
					liHTML += 	'<span class="foodName">'+item.name+'</span>';
					liHTML +=   '<span class="foodPrice">'+(item.cost/100)+'元'+'</span>';
					liHTML += '<li>';
				});
				ul.append(liHTML);
				shua()
			}
			function HTMLWork(data){
				var ul = $('#work ul');
				var liHTML = '';
				var ArrayData = data.rt;
				ArrayData.forEach( function(item, index) {
					liHTML += '<li data-id='+item.id+'>';
					liHTML += 	'<span class="foodName">'+item.name+'</span>';
					liHTML +=   '<span class="foodPrice">'+(item.cost/100)+'元'+'</span>';
					liHTML += '<li>';
				});
				ul.append(liHTML);
				shua()
			}
			function shua() {
				// 输入菜名 更新列表
				$('.input-group .name').keyup(function() {
						var $this = $(this);
						var $li = $(this).siblings('.foodlist').find("li");
						var reg = new RegExp($this.val())
						$li.each(function(index,el) {
							if (!reg.test($(this).find('.foodName').text())) {
								$(this).hide();
							} else {
								$(this).show();
							}
						});
				});
				// 点击列表 , 更新菜名和价格
				$(".input-group .foodlist li").each(function(index, el) {
					$(el).click(function(event){
						$this = $(this);
						$parent = $this.parent();
						$parent.parent().attr('data-id',$this.attr('data-id'));
						$parent.siblings('.name').val($this.find('.foodName').text());
						$parent.siblings('.price').val($this.find('.foodPrice').text());
						$parent.hide();
						return false;
					})
				});
			}
		}
	},
	// 二厨配菜页面
	twoLineup: function (){
		var url = window.location;
		// 店名
		$('#shopName option').html(this.getUrlParam(url,'codeName'));
		// 日期
		$("#canData").val(this.getUrlParam(url,'date'));
		// 文化餐主菜
		if (this.getUrlParam(url,'item')!='undefined') {
			var item = JSON.parse(this.getUrlParam(url,'item'));
			$("#BIZ_MAIN").val(item.biz.main.name);
			$("#JOB_MAIN").val(item.job.main.name);
			public.getBizSide(HTMLBiz);
			function HTMLBiz(data){
				var data = data.rt;
				data.forEach( function(item, index) {
					$(".biz").append('<option value='+item.cost+' data-id=' + item.id +'>'+item.name+'</option>')
				});
			}
			public.getJobSide(HTMLJob);
			function HTMLJob(data){
				var data = data.rt;
				data.forEach( function(item, index) {
					$(".job").append('<option value='+item.cost+' data-id=' + item.id +'>'+item.name+'</option>')
				});
			}
			$("#sure").click(function(event) {
			  event.preventDefault();
			  public.checkTwo();
		    });
		}
		$(".btnreturn").click(function(event) {
			event.preventDefault();
			window.history.go(-1);
		})
	},
	// 二厨验证 配菜
	checkTwo : function (){
		var url = window.location;
		var id = this.getUrlParam(url,'dataId');
		var mc = this.getUrlParam(url,'code');
		var date = this.getUrlParam(url,'date');
		var $biz = $(".biz :selected");
		var $job = $(".job :selected");
		var dish = [];
		$biz.each(function(index, el) {
			var obj = {
				type : 'biz',
				id : $(this).attr('data-id'),
				name : $(this).text(),
				cost : $(this).val()
			}
			dish.push(obj);
		});
		var dish = JSON.stringify(dish);
		var url = '&id=' + id + '&mc=' + mc + '&date=' + date + '&dish=' + dish ;
		var jobdish = [];
		$job.each(function(index, el) {
			var obj = {
				type : 'job',
				id : $(this).attr('data-id'),
				name : $(this).text(),
				cost : $(this).val()
			}
			jobdish.push(obj);
		});
		var jobdish = JSON.stringify(jobdish);
		var joburl = '&id=' + id + '&mc=' + mc + '&date=' + date + '&dish=' + jobdish ;
		this.setSide(url,function(data){
			console.log(data);
			public.setSide(joburl,function(data){
				console.log(data);
			})
		})
	},
	// 验证菜单是否填齐全 
	checkSetMain : function (){
		var url = window.location;
		var id = this.getUrlParam(url,'dataId');
		var mc = this.getUrlParam(url,'code');
		var date = this.getUrlParam(url,'date');
		var chef =  $("#mobile").val();
		var BIZ_MAIN = $("#BIZ_MAIN");
		var JOB_MAIN = $("#JOB_MAIN");
		if (!BIZ_MAIN.find('.price').val() || !JOB_MAIN.find('.price').val()) {
			alert('请把文化餐主菜或工作餐主菜填写完整');
			return false;
		} else {
			var dish = {
				type : 'biz',
				id : BIZ_MAIN.attr('data-id'),
				name : BIZ_MAIN.find('.name').val(),
				cost :  parseInt(BIZ_MAIN.find('.price').val()) * 100
			} 
			dish = JSON.stringify(dish);
			var url = '&id=' + id + '&mc=' + mc + '&date=' + date + '&dish=' + dish + '&chef=' + chef;
			public.setMain(url,function (){
				var dishr = {
					type : 'job',
					id : JOB_MAIN.attr('data-id'),
					name : JOB_MAIN.find('.name').val(),
					cost :  parseInt(JOB_MAIN.find('.price').val()) * 100,
				} 
				var dishr = JSON.stringify(dishr);
				var url = '&id=' + id + '&mc=' + mc + '&date=' + date + '&dish=' + dishr + '&chef=' + chef;
				public.setMain(url,function (){
					window.history.go(-1);
				});
			});
		}
	},
	mastercheckSetMain : function (){
		var url = window.location;
		var id = this.getUrlParam(url,'dataId');
		var mc = this.getUrlParam(url,'code');
		var date = this.getUrlParam(url,'date');
		var chef =  $("#mobile").val();
		var BIZ_MAIN = $("#BIZ_MAIN");
		var JOB_MAIN = $("#JOB_MAIN");
		if (!BIZ_MAIN.find('.price').val() || !JOB_MAIN.find('.price').val()) {
			alert('请把文化餐主菜或工作餐主菜填写完整');
			return false;
		} else {
			var dish = {
				type : 'biz',
				id : BIZ_MAIN.attr('data-id'),
				name : BIZ_MAIN.find('.name').val(),
				cost :  parseInt(BIZ_MAIN.find('.price').val()) * 100
			} 
			dish = JSON.stringify(dish);
			var url = '&id=' + id + '&mc=' + mc + '&date=' + date + '&dish=' + dish + '&chef=' + chef;
			public.setMain(url);
			var dish = {
				type : 'job',
				id : JOB_MAIN.attr('data-id'),
				name : JOB_MAIN.find('.name').val(),
				cost :  parseInt(JOB_MAIN.find('.price').val()) * 100,
			} 
			dish = JSON.stringify(dish);
			var url = '&id=' + id + '&mc=' + mc + '&date=' + date + '&dish=' + dish + '&chef=' + chef;
			public.setMain(url,function (){
				// window.history.go(-1);
			});
		}
	},
	// 设置配菜
	setSide : function (url,callback){
		$.ajax({
			url: this.url + this.setside + url,
			type: 'GET',
			dataType:'json',
	       	xhrFields : {
	       		withCredentials:true
	       	},  
			success: function (data){
				if (!data.code == 200) {
					
				} else {
					callback && callback(data)
				}
			},
			error : function (msg){
				console.log(msg)
			}
		});
	},
	// 报名 并 设置主菜
	setMain : function (url,callback){
		$.ajax({
			url: this.url + this.setmain + url,
			type: 'GET',
			dataType:'json',
	       	xhrFields : {
	       		withCredentials:true
	       	},  
			success: function (data){
				if (!data.code == 200) {
					
				} else {
					callback && callback(data)
				}
			},
			error : function (msg){
				console.log(msg)
			}
		});
	},
	// 删除主菜验证
	checkUnsetmain : function (){
		var url = window.location;
		var id = this.getUrlParam(url,'dataId');
		var mc = this.getUrlParam(url,'code');
		var date = this.getUrlParam(url,'date');
		var url = '&id=' + id + '&mc=' + mc + '&date=' + date;
		this.unSetmain(url);
	},
	// 删除主菜
	unSetmain : function (url,callback) {
		$.ajax({
			url: this.url + this.unsetmain + url,
			type: 'GET',
			dataType:'json',
	       	xhrFields : {
	       		withCredentials:true
	       	},  
			success: function (data){
				if (!data.code == 200) {
					
				} else {
					callback && callback(data)
				}
			},
			error : function (msg){
				console.log(msg)
			}
		});
	},
	// 禁止排餐请求
	setDisable : function (url,callback){
		$.ajax({
			url: this.url + this.setdisable + url,
			type: 'GET',
			dataType:'json',
	       	xhrFields : {
	       		withCredentials:true
	       	},  
			success: function (data){
				if (!data.code == 200) {
					
				} else {
					callback && callback(data)
				}
			},
			error : function (msg){
				console.log(msg)
			}
		});
	},
	// 允许排餐请求
	setEnable : function (url,callback) {
		$.ajax({
			url: this.url + this.setenable + url,
			type: 'GET',
			dataType:'json',
	       	xhrFields : {
	       		withCredentials:true
	       	},  
			success: function (data){
				if (!data.code == 200) {
					
				} else {
					callback && callback(data)
				}
			},
			error : function (msg){
				console.log(msg)
			}
		});
	},
	// 群主获得大厨信息
	chefList : function (callback) {
		$.ajax({
			url: this.url + this.cheflist,
			type: 'GET',
			dataType:'json',
	       	xhrFields : {
	       		withCredentials:true
	       	},  
			success: function (data){
				if (!data.code == 200) {
					
				} else {
					callback && callback(data)
				}
			},
			error : function (msg){
				console.log(msg)
			}
		});
	},	
	'noCalGo' : function () {
		var type = public.checkUsertype();
		switch (type) {
			case '1':
				window.location.href = '/set-calendar.html';
				break;
			case '2':
			case '3':
				window.location.href = '/no-calendar.html';
				break;
			default:
				// statements_def
				break;
		}
	},
	CalGo : function () {
		var type = public.checkUsertype();
		switch (type) {
			case '1':
				window.location.href = '/calendar.html';
				break;
			case '2':
			case '3':
				window.location.href = '/calendar.html';
				break;
			default:
				// statements_def
				break;
		}
	},
	// 首頁跟据权限跳转页面
	indexGo : function (){
		// 如果没有排餐日历
		this.getCalendar(public.CalGo,public.noCalGo);
	},
	// 获取账号信息
	returnUser : function (){
		var that = this;
		$.ajax({  
	       url: this.url + this.accountInfo,   
	       type:'GET',
	       dataType:'json',
	       xhrFields : {
	       		withCredentials:true
	       },  
	       success : function(result){ 
	   		  if (result.code == 200) {
	   		  	console.log('获得账号信息成功');
				console.log(result.rt);
				that.setUserCookie(result.rt);
				that.indexGo();
	   		  }
	       },  
	       error : function(msg) {  
	           console.log(msg);
	       }  
		}); 
	},
	// 设置排餐日历
	setCalendar: function (startDay,endDay){
		if (!startDay || !endDay) {
			return false;
		} else {
			var URL = this.url + this.setcalendar + '&start=' + startDay + '&end=' + endDay;
			$.ajax({
				url : URL,
				type : 'POST',
				dataType : 'json',
				xhrFields : {
	       			withCredentials:true
	       		},
	       		success : function (data){
	       			console.log(data);
	       			// window.location.href = '/signup.html';
	       		},
	       		error : function (msg){
					console.log(msg)
				}
			})
		}
	},
	// 获取排餐日历
	getCalendar : function (callback,callback2){
		var that = this;
		$.ajax({
			url: this.url + this.calendar,
			type: 'GET',
			dataType:'json',
	       	xhrFields : {
	       		withCredentials:true
	       	},  
			success: function (data){
				if (data.rt == null) {
					callback2 && callback2();
				} else {
					callback && callback(data)
				}
			},
			error : function (msg){
				console.log(msg)
			}
		});
	},
	// 获取文化餐主菜
	getCulture : function (callback,callback2){
		var that = this;
		$.ajax({
			url: this.url + this.BIZ_MAIN,
			type: 'GET',
			dataType:'json',
	       	xhrFields : {
	       		withCredentials:true
	       	},  
			success: function (data){
				if (!data.code == 200) {
					callback2 && callback2();
				} else {
					callback && callback(data)
				}
			},
			error : function (msg){
				console.log(msg)
			}
		});
	},
	// 获取工作餐主菜
	getWork : function (callback,callback2){
		var that = this;
		$.ajax({
			url: this.url + this.JOB_MAIN,
			type: 'GET',
			dataType:'json',
	       	xhrFields : {
	       		withCredentials:true
	       	},  
			success: function (data){
				if (!data.code == 200) {
					callback2 && callback2();
				} else {
					callback && callback(data)
				}
			},
			error : function (msg){
				console.log(msg)
			}
		});
	},
	// 获取工作餐配菜
	getJobSide : function (callback,callback2){
		var that = this;
		$.ajax({
			url: this.url + this.JOB_SIDE,
			type: 'GET',
			dataType:'json',
	       	xhrFields : {
	       		withCredentials:true
	       	},  
			success: function (data){
				if (!data.code == 200) {
					callback2 && callback2();
				} else {
					callback && callback(data)
				}
			},
			error : function (msg){
				console.log(msg)
			}
		});
	},
	// 获取工作餐配菜
	getBizSide : function (callback,callback2){
		var that = this;
		$.ajax({
			url: this.url + this.BIZ_SIDE,
			type: 'GET',
			dataType:'json',
	       	xhrFields : {
	       		withCredentials:true
	       	},  
			success: function (data){
				if (!data.code == 200) {
					callback2 && callback2();
				} else {
					callback && callback(data)
				}
			},
			error : function (msg){
				console.log(msg)
			}
		});
	},
	setUserCookie : function (user) {
		var value = JSON.stringify(user);
		$.cookie(this.cookieUserName, value, { expires: 1 });
	},
	getUserCookie : function (){
		var user = JSON.parse($.cookie(this.cookieUserName))
		return user;
	},
	deleteUserCookie : function () {
		$.cookie(this.cookieUserName, null);
	},
	isLogoin : function (){
		var user = $.cookie(this.cookieUserName);
		if (user == 'null') {
			return false;
		} else {
			return true;
		}
	},
	// 判断 用户 等级 返回 1 = 群主 | 2 = 大厨 | 3 = 二厨
	checkUsertype : function () {
		var userType = this.getUserCookie().type;
		if (userType == 'MASTER') {
			return '1';
		} else if (userType == 'CHEF') {
			return '2';
		} else if (userType == 'COMMIS') {
			return '3';
		}
	},
	// 退出登录
	logout : function (){
		var that = this;
		$.ajax({  
	       url: this.url + this.doLogout,   
	       type:'GET',
	       dataType:'json',
	       xhrFields : {
	       		withCredentials:true
	       },  
	       success : function(result){ 
	   		  if (result.code == 200) {
	   		  	alert('退出账号信息成功');
				that.deleteUserCookie();
				window.location.href = '/index.html';
	   		  }
	       },  
	       error : function(msg) {  
	           console.log(msg);
	       }  
		}); 
	},
	// 获得地址上的参数
	getUrlParam : function(url,name){
        var pattern = new RegExp("[?&]" + name +"\=([^&]+)","g");
        var matcher = pattern.exec(url);
        var items = null;
        if(matcher != null){
            try{
                items = decodeURIComponent(decodeURIComponent(matcher[1]));   
            }catch(e){
                try{
                    items = decodeURIComponent(matcher[1]);
                }catch(e){
                    items = matcher[1];
                }
            }
        }
        return items;
    },
    isEmptyObject : function (e) {
		var t;
		for (t in e)
			return !1;
		return !0
	}
}