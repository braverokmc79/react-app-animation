$(function(){

	var costItems, menuItems, defaultHtml = "", amountHtml = "", defaultOption = "<option value=''>선택</option>";

	for (var i = 0; i < 20; i++) {
		defaultHtml += "<tr data-index='" + i + "'>";
		defaultHtml += "<td><select name='type_" + i + "' data-type='type' class='w95'>" + defaultOption + "</select></td>";
		defaultHtml += "<td><select name='thick_" + i + "' data-type='thick' class='w55'>" + defaultOption + "</select></td>";
		defaultHtml += "<td><select name='color_" + i + "' data-type='color' class='w70'>" + defaultOption + "</select></td>";
		defaultHtml += "<td><input name='width_" + i + "' data-type='width' type='text' class='w_width'/></td>";
		defaultHtml += "<td><input name='height_" + i + "' data-type='height' type='text' class='w_height'/></td>";
		defaultHtml += "<td><input name='unitcost_" + i + "' data-type='unitcost' type='text' class='w_unitcost' readonly='readonly' /></td>";
		defaultHtml += "<td><select name='amount_" + i + "' data-type='amount' class='w60'>" + defaultOption + "</select></td>";
		defaultHtml += "<td><input name='cost_" + i + "' data-type='cost' type='text' class='w_cost' readonly='readonly'/></td>";
		defaultHtml += "</tr>";
	}
	defaultHtml += "<tr><td colspan='7' style='text-align:right;'><b>합  계</b></td><td><input id='totalcost' name='totalcost' type='text' class='w_cost' readonly='readonly' /></td></tr>";
	$("#tbl_main").append(defaultHtml);


//	$.getJSON( "/menu.json", function( data ) {
	$.getJSON( "/?act=shop.menu", function( data ) {	
		menuItems = eval(data);
		$.each(menuItems, function (index) {
			var optionHtml = "<option value='" + index + "'>" + index + "</option>";
			$("select[data-type='type']").append(optionHtml);
		});
	});

//	$.getJSON("/cost.json", function(data) {
	$.getJSON("/?act=shop.cost", function(data) {
		costItems = eval(data);
	});

	for (var i = 1; i < 31; i++) {
		amountHtml += "<option value='" + i + "'>"+ i +"</option>";
	};
	$("select[data-type='amount']").append(amountHtml);

	// 종류를 변경시
	$("select[data-type='type']").on('change', function() {
		var selectedIndex = getRowIndex(this);
		var selectedValue = $(this).val();
		var optionHtml = defaultOption;

		if (menuItems[selectedValue]["unitcost"]) {
			initSelectThick(selectedIndex);
			initSelectColor(selectedIndex);
			initInputWidth(selectedIndex);
			initInputHeight(selectedIndex);
			initSelectAmount(selectedIndex);
			initInputCost(selectedIndex);

			$("tr[data-index='" + selectedIndex + "'] input[data-type='unitcost']").val(menuItems[selectedValue]["unitcost"]);
			$("tr[data-index='" + selectedIndex + "'] input[data-type='width']").attr("readonly", true);
			$("tr[data-index='" + selectedIndex + "'] input[data-type='height']").attr("readonly", true);
			$("tr[data-index='" + selectedIndex + "'] input[data-type='cost']").val("수량을 선택해주세요.");

		} else {
			$.each(menuItems[selectedValue], function (index) {
				optionHtml += "<option value='" + index + "'>" + index + "</option>";
			});
			$("tr[data-index='" + selectedIndex + "'] select[data-type='thick']").html(optionHtml);
			
			initSelectColor(selectedIndex);
			initInputWidth(selectedIndex);
			initInputHeight(selectedIndex);
			initInputUnitCost(selectedIndex);
			initSelectAmount(selectedIndex);
			initInputCost(selectedIndex);
		}

		sumTotalCost();

	});

	$("select[data-type='thick']").on('change', function() {
		var selectedIndex = getRowIndex(this);
		var selectedType = $("tr[data-index='" + selectedIndex + "'] select[data-type='type']").val();
		var selectedValue = $(this).val();
		var optionHtml = defaultOption;
		$.each(menuItems[selectedType][selectedValue], function (index, item) {
			optionHtml += "<option value='" + item + "'>" + item + "</option>";
		});
		$("tr[data-index='" + selectedIndex + "'] select[data-type='color']").html(optionHtml);

		initInputWidth(selectedIndex);
		initInputHeight(selectedIndex);
		initInputUnitCost(selectedIndex);
		initSelectAmount(selectedIndex);
		initInputCost(selectedIndex);
	});

	$("select[data-type='color']").on('change', function() {
		var selectedIndex = getRowIndex(this);

		initInputWidth(selectedIndex);
		initInputHeight(selectedIndex);
		initInputUnitCost(selectedIndex);
		initSelectAmount(selectedIndex);
		initInputCost(selectedIndex);
	});


	$("input[data-type='width'], input[data-type='height']").on('keypress', function() {
		if (event.keyCode < 48 || event.keyCode > 57) {
			return event.returnValue = false;
		};
	}).on('change', function() {
		$(this).val( $(this).val().replace(/[^0-9]/gi,"") );
		var selectedIndex = getRowIndex(this);
		calcRowCost(selectedIndex);
	});

	$("input[data-type='width'], input[data-type='height']").on('change', function() {
		var selectedIndex = getRowIndex(this);
		calcRowCost(selectedIndex);
	});

	$("select[data-type='amount']").on('change', function() {
		var selectedIndex = getRowIndex(this);

		//var selectedValue = $("select[data-type='type']").val();
		var selectedValue = $("tr[data-index='" + selectedIndex + "'] select[data-type='type']").val()

		if (menuItems[selectedValue]["unitcost"]) {
			var cost = $(this).val() * $("tr[data-index='" + selectedIndex + "'] input[data-type='unitcost']").val();
			$("tr[data-index='" + selectedIndex + "'] input[data-type='cost']").val(cost);
			sumTotalCost();
		} else {
			calcRowCost(selectedIndex);
		}
	});

	$("input[data-type='cost']").on('change', function() {
		sumTotalCost();
	});

	$('#order_phone').on('keypress', function() {
		if ((event.keyCode < 48 || event.keyCode > 57) && event.keyCode != 45) {
			return event.returnValue = false;
		};
	}).on("change", function() {$(this).val( $(this).val().replace(/[^0-9:\-]/gi,"") );});

	$('#btn_order').on('click', function() {
		if($.trim($('#order_name').val()) == '') { alert('주문자 성명을 입력해주세요'); $('#order_name').focus();return; }
		if($.trim($('#order_phone').val()) == '') { alert('연락처를 입력해주세요'); $('#order_phone').focus();return; }
		if($.trim($('input[name="order_email"]').val()) == '') { alert('메일을 입력해주세요'); return; }


// 		emailStr = $('input[name="order_email"]').val();
// 		console.log(emailStr);
// 		var pattern =/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
// 		if (!pattern.test(emailStr)) {
// 			alert('메일형식이 올바르지 않습니다.');
// 			$('#order_email').focus();
// 			return;
// 		}
		
		document.forms[0].submit();
	});

	$('select').keypress(function(event) { return cancelBackspace(event) });
	$('select').keydown(function(event) { return cancelBackspace(event) });
	$('input[readonly="readonly"]').keypress(function(event) { return cancelBackspace(event) });
	$('input[readonly="readonly"]').keydown(function(event) { return cancelBackspace(event) });

	function cancelBackspace(event) {
		if (event.keyCode == 8) {
	        		return false;
	    	}
	}

	function initSelectThick(rowIndex) {
		$("tr[data-index='" + rowIndex + "'] select[data-type='thick']").html(defaultOption);
	}

	function initSelectColor(rowIndex) {
		$("tr[data-index='" + rowIndex + "'] select[data-type='color']").html(defaultOption);
	}

	function initInputWidth(rowIndex) {
		$("tr[data-index='" + rowIndex + "'] input[data-type='width']").val('');
		$("tr[data-index='" + rowIndex + "'] input[data-type='width']").attr('readonly', false);
	}

	function initInputHeight(rowIndex) {
		$("tr[data-index='" + rowIndex + "'] input[data-type='height']").val('');
		$("tr[data-index='" + rowIndex + "'] input[data-type='height']").attr('readonly', false);
	}

	function initInputUnitCost(rowIndex) {
		$("tr[data-index='" + rowIndex + "'] input[data-type='unitcost']").val('');
	}

	function initSelectAmount(rowIndex) {
		$("tr[data-index='" + rowIndex + "'] select[data-type='amount']").val('');
	}

	function initInputCost(rowIndex) {
		$("tr[data-index='" + rowIndex + "'] input[data-type='cost']").val('');
	}

	function getRowIndex(selctedObject) {
		return $(selctedObject).parent().parent().data('index');
	}

	function calcRowCost(rowIndex) {
		if ($("tr[data-index='" + rowIndex + "'] select[data-type='type'] option:selected").val() == '') {
			$("tr[data-index='" + rowIndex + "'] input[data-type='cost']").val("종류를 선택해주세요.");
			return;
		}

		if ($("tr[data-index='" + rowIndex + "'] select[data-type='thick'] option:selected").val() == '') {
			$("tr[data-index='" + rowIndex + "'] input[data-type='cost']").val("두께를 선택해주세요.");
			return;
		}

		if ($("tr[data-index='" + rowIndex + "'] select[data-type='color'] option:selected").val() == '') {
			$("tr[data-index='" + rowIndex + "'] input[data-type='cost']").val("색상을 선택해주세요.");
			return;
		}

		if ($("tr[data-index='" + rowIndex + "'] input[data-type='width']").val() == '') {
			$("tr[data-index='" + rowIndex + "'] input[data-type='cost']").val("가로길이를 입력해주세요.");
			return;
		}

		if ($("tr[data-index='" + rowIndex + "'] input[data-type='height']").val() == '') {
			$("tr[data-index='" + rowIndex + "'] input[data-type='cost']").val("세로길이를 입력해주세요.");
			return;
		}

		var unitCost = getUnitCost(rowIndex);
		if (isNaN(unitCost)) {
			$("tr[data-index='" + rowIndex + "'] input[data-type='cost']").val("배송불가사이즈.");
			$("tr[data-index='" + rowIndex + "'] input[data-type='unitcost']").val("배송불가사이즈.");
		} else {
			$("tr[data-index='" + rowIndex + "'] input[data-type='unitcost']").val(unitCost);

			if ($("tr[data-index='" + rowIndex + "'] select[data-type='amount'] option:selected").val() == '') {
				$("tr[data-index='" + rowIndex + "'] input[data-type='cost']").val("수량을 선택해주세요.");
				return;
			}

			var amout = $("tr[data-index='" + rowIndex + "'] select[data-type='amount']").val();


			$("tr[data-index='" + rowIndex + "'] input[data-type='cost']").val(unitCost * amout);
			sumTotalCost();
		}
	}

	function sumTotalCost() {
		var totalCost = 0;
		$.each($("input[data-type='cost']"), function(index, item) {
			if ($(item).val() != '' && !isNaN($(item).val())) {
				totalCost += parseInt($(item).val());
			}
		});
		$("#totalcost").val(totalCost);
	}

	function getLength(inputLength) {
		if (inputLength < 50) {
			return 50;
		} else {
			return Math.ceil(inputLength / 50) * 50;
		}
	}

	function getUnitCost(rowIndex) {
		var type = $("tr[data-index='" + rowIndex + "'] select[data-type='type'] option:selected").val();
		var thick = $("tr[data-index='" + rowIndex + "'] select[data-type='thick'] option:selected").val();
		var widthValue = $("tr[data-index='" + rowIndex + "'] input[data-type='width']").val();
		var heightValue = $("tr[data-index='" + rowIndex + "'] input[data-type='height']").val();
		//alert("" + $("tr[data-index='" + rowIndex + "'] input[data-type='width']").val() + " : " + $("tr[data-index='" + rowIndex + "'] input[data-type='height']").val());
		if (widthValue < 10 || heightValue < 10) {
			//alert('배송불가');
			return "배송불가사이즈";
		} else {
			var width = getLength(widthValue);
			//console.log($("tr[data-index='" + rowIndex + "'] input[data-type='height']").val());
			var heightIndex = Math.ceil(heightValue / 50) - 1;

			if (costItems && costItems[type+thick] && costItems[type+thick][width] && costItems[type+thick][width][heightIndex]) {
				//console.log('type[' + type + '], thick[' + thick + '], width[' + width + '], heightIndex[' + heightIndex + ']');
				return costItems[type+thick][width][heightIndex];
			} else {
				return "허용크기가 아닙니다.";
			}
		}
	}
});