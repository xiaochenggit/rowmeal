$(function(){
	$(".loginOut").click(function(event) {
		public.logout();
	});
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
	       		if (result.code == 200) {
	       			public.returnUser();
	       		} else{
	       			alert('账号或密码错误!请重新填写')
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
	schedulecreate : 'api/scheduleCreate', 
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
	// 筛选文化餐主菜
	getBIZ_MAIN : 'api/dishList&type=BIZ_MAIN&keyword=',
	// 筛选工作餐主菜
	getJOB_MAIN	: 'api/dishList&type=JOB_MAIN&keyword=',
	// 筛选文化餐配菜
	getBIZ_SIDE : 'api/dishList&type=BIZ_SIDE&keyword=',
	// 筛选工作餐配菜
	getJOB_SIDE	: 'api/dishList&type=JOB_SIDE&keyword=',
	// 设置主菜
	setmain : 'api/setMain',
	// 设置配菜
	setside: 'api/setSide',
	// 日历确认
	scheduleconfirm :'r=api/scheduleConfirm&id=',
	setconfirm: 'api/setConfirm',
	// 删除主菜
	unsetmain : 'api/unsetMain',
	// 群主获得大厨信息
	cheflist : 'api/chefList&keyword=',
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
	// calendar 页面 根据返回数据渲染页面
	setcalendarHTML : function (DATA){
		 //var DATA = { "code": 200, "msg": "", "rt": { "id": 0, "start": "2017-04-01", "end": "2017-04-02", "data": [ { "merchant": { "code": "BEJYD", "name": "远东店" }, "items": [ { "date": "2017-04-01", "dish": null, "status": 0 }, { "date": "2017-04-02", "dish": {}, "status": 1 } ] }, { "merchant": { "code": "BEJLK", "name": "临空店" }, "items": [ { "date": "2017-04-01", "dish": { "biz": { "main": { "id": 1, "name": "菜名", "cost": 1500, "chef": { "mobile": "13912345670", "name": "张三" } } } }, "status": 2 }, { "date": "2017-04-02", "dish": { "biz": { "main": { "id": 2, "name": "菜名", "cost": 1800, "chef": { "mobile": "13912345671", "name": "李四" } }, "side": [ { "id": 20, "name": "菜名" }, { "id": 21, "name": "菜名" } ] }, "job": { "main": { "id": 3, "name": "菜名", "cost": 1600, "chef": { "mobile": "13912345671", "name": "李四" } }, "side": [ { "id": 30, "name": "菜名" } ] } }, "status": 3 } ] } ] } };
		var data = DATA.rt;
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
			bodyHTML +=                 '<span class="num">'+public.getDate(item.date)+'</span>';
			bodyHTML += 			'</p>';
		});
		bodyHTML +=				'</li>';
		Arraydata.forEach( function(item, index) {
			bodyHTML += 		'<li class="clearfix drag">';
			item.items.forEach( function(element, index) {
				// 没有排餐 根据权限显示不同内容
				if (!public.isEmptyObject(element.dish)) {
						bodyHTML += 		'<p class="reAdd" dr_replace='+1+' dr_drag ='+1+' status='+element.status+' date='+element.date+' data-id='+data.id+' codeName='+item.merchant.name+' code='+item.merchant.code+'>';
						bodyHTML +=         	'<span>'+element.dish.biz.main.chef.name+'</span>';
						bodyHTML +=         	'<span>'+element.dish.biz.main.name+'</span>'
						bodyHTML += 		'</p>';
				} else {
					if(public.checkUsertype() == 1) {
						bodyHTML += 		'<p class="reAdd" dr_replace='+1+' dr_drag ='+1+' status='+element.status+'  date='+element.date+' data-id='+data.id+' codeName='+item.merchant.name+' code='+item.merchant.code+'>';
						bodyHTML +=         	'<span>'+'暂无'+'</span>';
						bodyHTML +=         	'<span>'+'报名'+'</span>'
						bodyHTML += 		'</p>';
					} else {
						bodyHTML += 		'<p class="reAdd " dr_replace='+1+' dr_drag ='+1+' status='+element.status+' date='+element.date+' data-id='+data.id+' codeName='+item.merchant.name+' code='+item.merchant.code+'>';
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
			public.sureCal(DATA.rt.id);
		})
		// 点击排餐
		$(".reAdd").click(function(event) {
			var $this = $(this);
			var status = $this.attr("status");
			if (status == 0 && public.checkUsertype() != 1) {
				alert($this.attr("date") + '当天不排餐');
				return false;
			}
			if (status == 1 && public.checkUsertype() == 3) {
				alert('大厨暂未设置主菜');
				return false;
			}
			if (status == 4 && public.checkUsertype() > 1) {
				alert('排餐已经确认');
				return false;
			};
			var date = $this.attr("date");
			var dataId = $this.attr("data-id");
			var code = $this.attr("code");
			var codeName = $this.attr("codeName");
			DATA.rt.data.forEach( function(item, index) {
				if (item.merchant.code == code) {
					item.items.forEach( function(element, index) {
						if (element.date == date) {
							public.setItemCookie(element.dish);
							var reUrl = 'status=' + status
								+ '&date=' + date + '&dataId=' + dataId + '&code=' + code + '&codeName=' + codeName;
							if ((status == 3|| status==4) && public.checkUsertype() == 1) {
								window.location.href = '/detailed.html?' + reUrl;
								return false;
							};
							if (public.checkUsertype() == 1) {
								window.location.href = '/masterLineup.html?' + reUrl;
							}
							else if (public.checkUsertype() == 2) {
								window.location.href = '/oneLineup.html?' + reUrl;
							} else {
								window.location.href = '/twoLineup.html?' + reUrl;
							}
						}
					});
				}
			});
		});
		// 排餐日历 伸缩窗口
		function getWidth (){
			var length = maxlength = $(".weeklist > p").length;
			if (length >= 5) {
				var maxlength = 5;
				$(".weeklist p").eq(4).find('i').remove();
				$(".weeklist p").eq(4).append(' <i class="fa fa-hand-o-right" style="font-size:24px;"></i>');
			} else {
				$("#week ul").css({
					overflow: 'hidden'
				});
			}
			var width = Math.floor($("#week").width() / maxlength);
			var $p = $("#week p");  
			$("#week li").width($(".weeklist > p").length * width + $(".weeklist > p").length);
			$p.width(width);
		}
		getWidth();
		window.onresize = function (){
			getWidth();
		}
	},
	sureCal: function (id){
		var IsOk = true;
		$(".reAdd").each(function(index, el) {
			var status = $(el).attr("status")
			if (status != 0 && status != 4) {
				IsOk = false;
				alert('排餐信息不完整!');
				return false;
			}
		});
		if (IsOk) {
			var message = window.confirm('是否确认排餐?');
			if (message) {
				public.scheduleConfirm(id,function(){
					window.history.go(-1);
				})
			}
		};
	},
	// 群主的排餐页面
	markerLineup : function (){
		var url = window.location;
		// 店名
		$('#shopName option').html(this.getUrlParam(url,'codeName'));
		// 日期
		$("#canData").val(this.getUrlParam(url,'date'));
		// 如果有数据
		if (public.getItemCookie()) {
			var item = public.getItemCookie();
			$("#cherfName .name").val(item.biz.main.chef.name);
			$("#mobile").val(item.biz.main.chef.mobile);
			$("#BIZ_MAIN .name").val(item.biz.main.name);
			$("#BIZ_MAIN .price").val(item.biz.main.cost/100 + '元');
			$("#JOB_MAIN .name").val(item.biz.main.name);
			$("#JOB_MAIN .price").val(item.biz.main.cost/100 + '元');
		}
		if (this.checkUsertype() == 1) {
			var user = this.getUserCookie();
			$('#cherfName').on('keyup click',function (){
				var name = $(this).find('.name').val();
				$('#cherfName ul').remove();
				public.chefList(name,HTMLcherf);
			})
			$('#BIZ_MAIN').on('keyup click',function (){
				var name = $(this).find('.name').val();
				$('#BIZ_MAIN ul').remove();
				public.getbiz_main(name,HTMLCulture);
			})
			$('#JOB_MAIN').on('keyup click',function (){
				var name = $(this).find('.name').val();
				$('#JOB_MAIN ul').remove();
				public.getjob_main(name,HTMLWork);
			})
			// 点击报名
			$("#oneBtn").click(function (event){
				event.preventDefault();
				public.mastercheckSetMain();
			})
			// 删除
			$("#deleteBtn").click(function(event) {
				event.preventDefault()
				public.checkUnsetmain(function(){
					window.location.href='/calendar.html';
				});
			});
			// 返回
			$("#reBtn").click(function(event) {
				event.preventDefault();
				window.location.href='/calendar.html';
			});
			// 不排餐
			var status = this.getUrlParam(url,'status');
			if (status == 2) {
				$("#oneBtn").remove();
			};
			if (status==0) {
				$("#noBtn").removeClass('noBtn').html('排餐');
				$("#oneBtn").remove();
				$("#deleteBtn").remove();
			}
			$("#noBtn").click(function(event) {
				event.preventDefault();
				var url = window.location;
				var id = public.getUrlParam(url,'dataId');
				var mc = public.getUrlParam(url,'code');
				var date = public.getUrlParam(url,'date');
				var url = '&id='+id+'&mc='+mc+'&date='+date;
				if ($(this).hasClass('noBtn')) {
					if (status >= 2) {
						public.unSetmain(url);
					};
					public.setDisable(url,function (){
						window.location.href='/calendar.html';
					});
				} else {
					public.setEnable(url,function(){
						window.location.href='/calendar.html';
					});
				}
			});
			function HTMLcherf(data){
				var data = data.rt;
				if (data.length > 0) {
					var BIZ_MAIN = $('#cherfName');
					var liHTML = '<ul class="foodlist">';
					data.forEach( function(item, index) {
						liHTML += '<li data-id='+item.mobile+'>';
						liHTML += 	'<span class="foodName">'+item.name+'</span>';
						liHTML += '<li>';
					});
					liHTML += '</ul>';
					BIZ_MAIN.append(liHTML);
					shua1();
				};
			}
			function HTMLCulture(data){
				var data = data.rt;
				if (data.length > 0) {
					var BIZ_MAIN = $('#BIZ_MAIN');
					var liHTML = '<ul class="foodlist">';
					data.forEach( function(item, index) {
						liHTML += '<li data-id='+item.id+'>';
						liHTML += 	'<span class="foodName">'+item.name+'</span>';
						liHTML +=   '<span class="foodPrice">'+(item.cost/100)+'元'+'</span>';
						liHTML += '<li>';
					});
					liHTML += '</ul>';
					BIZ_MAIN.append(liHTML);
					shua();
				};
			}
			function HTMLWork(data){
				var data = data.rt;
				if (data.length > 0) {
					var JOB_MAIN = $('#JOB_MAIN');
					var liHTML = '<ul class="foodlist">';
					data.forEach( function(item, index) {
						liHTML += '<li data-id='+item.id+'>';
						liHTML += 	'<span class="foodName">'+item.name+'</span>';
						liHTML +=   '<span class="foodPrice">'+(item.cost/100)+'元'+'</span>';
						liHTML += '<li>';
					});
					liHTML += '</ul>';
					JOB_MAIN.append(liHTML);
					shua();
				};
			}
			function shua() {
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
			function shua1() {
				$(".input-group .foodlist li").each(function(index, el) {
					$(el).click(function(event){
						$this = $(this);
						$parent = $this.parent();
						$("#mobile").val($this.attr('data-id'));
						$parent.siblings('.name').val($this.find('.foodName').text());
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
		if (public.getItemCookie()) {
			var item = public.getItemCookie();
			if (item.biz) {
				$("#name").val(item.biz.main.chef.name);
				if ($("#name").val()!= this.getUserCookie().name) {
					$("#oneBtn").remove();
				};
				$("#mobile").val(item.biz.main.chef.mobile);
				$("#BIZ_MAIN .name").val(item.biz.main.name);
				$("#BIZ_MAIN .price").val(item.biz.main.cost/100 + '元');
			} 
			if (item.job) {
				$("#name").val(item.job.main.chef.name);
				$("#mobile").val(item.job.main.chef.mobile);
				$("#JOB_MAIN .name").val(item.job.main.name);
				$("#JOB_MAIN .price").val(item.job.main.cost/100 + '元');
			}
			
		}
		if (this.checkUsertype() == 2) {
			$('#BIZ_MAIN').on('keyup click',function (){
				var name = $(this).find('.name').val();
				$('#BIZ_MAIN ul').remove();
				public.getbiz_main(name,HTMLCulture);
			})
			$('#JOB_MAIN').on('keyup click',function (){
				var name = $(this).find('.name').val();
				$('#JOB_MAIN ul').remove();
				public.getjob_main(name,HTMLWork);
			})
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
				var data = data.rt;
				if (data.length > 0) {
					var BIZ_MAIN = $('#BIZ_MAIN');
					var liHTML = '<ul class="foodlist">';
					data.forEach( function(item, index) {
						liHTML += '<li data-id='+item.id+'>';
						liHTML += 	'<span class="foodName">'+item.name+'</span>';
						liHTML +=   '<span class="foodPrice">'+(item.cost/100)+'元'+'</span>';
						liHTML += '<li>';
					});
					liHTML += '</ul>';
					BIZ_MAIN.append(liHTML);
					shua();
				};
			}
			function HTMLWork(data){
				var data = data.rt;
				if (data.length > 0) {
					var JOB_MAIN = $('#JOB_MAIN');
					var liHTML = '<ul class="foodlist">';
					data.forEach( function(item, index) {
						liHTML += '<li data-id='+item.id+'>';
						liHTML += 	'<span class="foodName">'+item.name+'</span>';
						liHTML +=   '<span class="foodPrice">'+(item.cost/100)+'元'+'</span>';
						liHTML += '<li>';
					});
					liHTML += '</ul>';
					JOB_MAIN.append(liHTML);
					shua();
				};
			}
			function shua() {
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
		if (public.getItemCookie() != 'undefined') {
			var item = public.getItemCookie();
			$("#BIZ_MAIN").val(item.biz.main.name);
			$("#JOB_MAIN").val(item.job.main.name);
			if (item.biz.side) {
				item.biz.side.forEach( function(element, index) {
					if (index==0) {
						$(".BIZ_SIDE .name").val(element.name);
						$(".BIZ_SIDE .name").attr('data-id',element.id);
						$(".BIZ_SIDE .price").val(element.cost + '元');
					} else {
						$("#DIZ").append('<div class="food-list clearfix"><label><span>配菜</span><div class="input input-group BIZ_SIDE" data-id=""><input type="text" value='+element.name+' class="name"  data-id='+element.id+'><input type="text"  value='+element.cost+"元"+' class="price" ></div></label><i class="fa fa-minus"></i></div>')
					}
				});
			}
			if (item.job.side) {
				item.job.side.forEach( function(element, index) {
					if (index==0) {
						$(".JOB_SIDE .name").val(element.name);
						$(".JOB_SIDE .name").attr('data-id',element.id);
						$(".JOB_SIDE .price").val(element.cost + '元');
					} else {
						$("#JOB").append('<div class="food-list clearfix"><label><span>配菜</span><div class="input input-group BIZ_SIDE" data-id=""><input type="text" value='+element.name+' class="name"  data-id='+element.id+'><input type="text"  value='+element.cost+"元"+' class="price" ></div></label><i class="fa fa-minus"></i></div>')
					}
				});
			}
			$("#sure").click(function(event) {
			  event.preventDefault();
			  public.checkTwo();
		    });
		    $(".JOB_SIDE").bind('keyup',function(){
		    	var $this = $(this);
		    	var name = $this.find('.name').val();
		    	$this.find("ul").remove();
		    	public.getjob_side(name,function(data){
					HTMLWork(data,$this);
				});
		    })
		    $(".BIZ_SIDE").bind('keyup',function(){
		    	var $this = $(this);
		    	var name = $this.find('.name').val();
		    	$this.find("ul").remove();
		    	public.getbiz_side(name,function(data){
					HTMLCulture(data,$this);
				});
		    })
		    $(document).on('click','.food-list',function(event){
				var $parent = $(this).parent();
				var target = $(event.target);
				if (target.hasClass('fa-plus')) {
					target.parent().parent().append('<div class="food-list clearfix">'+target.parent().html()+"</div>");
					$(".JOB_SIDE").unbind('keyup');
					$(".JOB_SIDE").bind('keyup',function(){
				    	var $this = $(this);
				    	var name = $this.find('.name').val();
				    	$(".JOB_SIDE").find("ul").remove();
				    	public.getjob_side(name,function(data){
							HTMLWork(data,$this);
						});
			    	})
			    	$(".BIZ_SIDE").unbind('keyup');
			    	$(".BIZ_SIDE").bind('keyup',function(){
				    	var $this = $(this);
				    	var name = $this.find('.name').val();
				    	$(".BIZ_SIDE").find("ul").remove();
				    	public.getbiz_side(name,function(data){
							HTMLCulture(data,$this);
						});
				    })
			    	$("#JOB .fa-plus:gt(0)").removeClass('fa-plus').addClass('fa-minus');
			    	$("#DIZ .fa-plus:gt(0)").removeClass('fa-plus').addClass('fa-minus');
					return false;
				} else if (target.hasClass('fa-minus')){
					target.parent().remove();
				} else {
					return false;
				}
			})
		    function HTMLCulture(data,thist){
				var data = data.rt;
				if (data.length > 0) {
					thist.find('ul').remove();
					var liHTML = '<ul class="foodlist">';
					data.forEach( function(item, index) {
						liHTML += '<li data-id='+item.id+'>';
						liHTML += 	'<span class="foodName">'+item.name+'</span>';
						liHTML +=   '<span class="foodPrice">'+(item.cost/100)+'元'+'</span>';
						liHTML += '<li>';
					});
					liHTML += '</ul>';
					thist.append(liHTML);
					shua();
				};
			}
			function HTMLWork(data,thist){
				var data = data.rt;
				if (data.length > 0) {
					// var JOB_MAIN = $('#JOB_MAIN');
					var liHTML = '<ul class="foodlist">';
					data.forEach( function(item, index) {
						liHTML += '<li data-id='+item.id+'>';
						liHTML += 	'<span class="foodName">'+item.name+'</span>';
						liHTML +=   '<span class="foodPrice">'+(item.cost/100)+'元'+'</span>';
						liHTML += '<li>';
					});
					liHTML += '</ul>';
					thist.append(liHTML);
					shua();
				};
			}
			function shua() {
				$(".input-group .foodlist li").each(function(index, el) {
					$(el).click(function(event){
						$this = $(this);
						$parent = $this.parent();
						$parent.siblings('.name').attr('data-id',$this.attr('data-id'));
						$parent.siblings('.name').val($this.find('.foodName').text());
						$parent.siblings('.price').val($this.find('.foodPrice').text());
						$parent.remove();
						return false;
					})
				});
			}
		}
		$(".btnreturn").click(function(event) {
			event.preventDefault();
			window.history.go(-1);
		})
	},
	// 群主的排餐信息页面
	detailed : function (){
		var url = window.location;
		// 店名
		$('#shopName option').html(this.getUrlParam(url,'codeName'));
		// 日期
		$("#canData").val(this.getUrlParam(url,'date'));
		var status = this.getUrlParam(url,'status');
		if (status == 4) {
			$('#sure').remove();
		};
		var item = public.getItemCookie();
		$("#name").val(item.biz.main.chef.name);
		$("#mobile").val(item.biz.main.chef.mobile);
		$("#BIZ_MAIN").val(item.biz.main.name);
		var BIZ_SIDE = '';
		item.biz.side.forEach( function(item, index) {
			BIZ_SIDE += '<div class="food-list clearfix">';
			BIZ_SIDE +=    '<label>';
			BIZ_SIDE +=       '<span>配菜</span>';
			BIZ_SIDE +=       '<input type="text" class="input" value='+item.name+' disabled>';
			BIZ_SIDE +=    '</label>';
			BIZ_SIDE += '</div>';
		});
		$("#BIZ").append(BIZ_SIDE);
		var jOB_SIDE = '';
		item.job.side.forEach( function(item, index) {
			jOB_SIDE += '<div class="food-list clearfix">';
			jOB_SIDE +=    '<label>';
			jOB_SIDE +=       '<span>配菜</span>';
			jOB_SIDE +=       '<input type="text" class="input" value='+item.name+' disabled>';
			jOB_SIDE +=    '</label>';
			jOB_SIDE += '</div>';
		});
		$("#JOB").append(jOB_SIDE);
		$("#JOB_MAIN").val(item.job.main.name);
		$("#reBtn").click(function (event){
			event.preventDefault();
			window.history.go(-1);
		});
		$("#delete").click(function (event){
			event.preventDefault();
			public.checkUnsetmain();
		});
		$("#sure").click(function (event){
			event.preventDefault();
			var url = window.location;
			var id = public.getUrlParam(url,'dataId');
			var mc = public.getUrlParam(url,'code');
			var date = public.getUrlParam(url,'date');
			var ba = Math.floor($("#ba").val());
			var bp = parseFloat($("#bp").val()).toFixed(2);
			var ja = Math.floor($("#ja").val());
			var jp = parseFloat($("#jp").val()).toFixed(2);
			if (!ba || !bp || !ja || !jp) {
				alert('份数价格要填完整');
				return false;
			}
			var getUrl = '&id=' + id + '&mc=' + mc + '&date=' + date + '&ba=' + ba + 
			'&bp=' + bp + '&ja=' + ja + '&jp=' + jp;
			public.setConfirm(getUrl,function(data){
				window.location.href='/calendar.html';
			})
		})
	},
	// 二厨验证 配菜
	checkTwo : function (){
		var url = window.location;
		var id = this.getUrlParam(url,'dataId');
		var mc = this.getUrlParam(url,'code');
		var date = this.getUrlParam(url,'date');
		var $biz = $(".BIZ_SIDE .name");
		var $job = $(".JOB_SIDE .name");
		var dish = [];
		$biz.each(function(index, el) {
			var obj = {
				type : 'biz',
				id : $(this).attr('data-id'),
				name : $(this).val(),
				cost : parseInt($(this).siblings('.price').val())
			}
			dish.push(obj);
		});
		$job.each(function(index, el) {
			var obj = {
				type : 'job',
				id : $(this).attr('data-id'),
				name : $(this).val(),
				cost : parseInt($(this).siblings('.price').val())
			}
			dish.push(obj);
		});
		if (dish.length <= 1) {
			alert('请把配菜信息填写完整');
		}
		var dish = JSON.stringify(dish);
		var url = '&id=' + id + '&mc=' + mc + '&date=' + date + '&dish=' + dish ;
		this.setSide(url,function(data){
			window.location.href='/calendar.html';
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
					window.location.href='/calendar.html';
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
				window.location.href='/calendar.html';
			});
		}
	},
	// 群主确认排餐信息 
	setConfirm : function (url,callback) {
		$.ajax({
			url: this.url + this.setconfirm + url,
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
		this.unSetmain(url,function(){
			window.location.href='/calendar.html';
		});
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
	chefList : function (url,callback) {
		$.ajax({
			url: this.url + this.cheflist + url + '&limit=',
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
	       			 window.location.href = '/calendar.html';
	       		},
	       		error : function (msg){
					console.log(msg)
				}
			})
		}
	},
	// 确认排餐信息
	scheduleCreate : function (url,callback){
		$.ajax({
			url: this.url + this.schedulecreate + url,
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
	// 日历确认
	scheduleConfirm : function (id,callback){
		$.ajax({
			url: this.url + this.scheduleconfirm + id,
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
	getjob_side : function (url,callback){
		$.ajax({
			url: this.url + this.getJOB_SIDE + url + '&limit=',
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
	// 获取文化餐配菜
	getbiz_side : function (url,callback){
		$.ajax({
			url: this.url + this.getBIZ_SIDE + url + '&limit=',
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
	getjob_main : function (url,callback){
		$.ajax({
			url: this.url + this.getJOB_MAIN + url + '&limit=',
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
	// 获取文化餐主菜
	getbiz_main : function (url,callback){
		$.ajax({
			url: this.url + this.getBIZ_MAIN + url + '&limit=',
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
	setItemCookie : function (item) {
		var value = JSON.stringify(item);
		$.cookie('rowmealItem', value, { expires: 1 });
	},
	getItemCookie : function (item) {
		var item = JSON.parse($.cookie('rowmealItem'))
		return item;
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
    // 返回 217-05-02 是星期几
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
    getDate: function (value){
    	DateMonth = parseInt(KingVal.split("-")[1]);
	    DateDay = parseInt(KingVal.split("-")[2]);
    	return DateMonth+'/'+DateDay;
    },
    isEmptyObject : function (e) {
		var t;
		for (t in e)
			return !1;
		return !0
	}
}