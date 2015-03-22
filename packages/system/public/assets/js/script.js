var tables = {
	1: {
		x: 60,
		y: 200,
		width: 70,
		height: 70,
		numSeats: 12,
		members: []
	},
	2: {
		x: 60,
		y: 283,
		width: 70,
		height: 70,
		numSeats: 12,
		members: []
	},
	3: {
		x: 60,
		y: 366,
		width: 70,
		height: 70,
		numSeats: 12,
		members: []
	},
	4: {
		x: 60,
		y: 451,
		width: 70,
		height: 70,
		numSeats: 12,
		members: []
	},
	5: {
		x: 146,
		y: 230,
		width: 70,
		height: 70,
		numSeats: 12,
		members: []
	},
	6: {
		x: 142,
		y: 320,
		width: 70,
		height: 70,
		numSeats: 12,
		members: []
	},
	7: {
		x: 155,
		y: 478,
		width: 70,
		height: 70,
		numSeats: 12,
		members: []
	},
	8: {
		x: 372,
		y: 228,
		width: 70,
		height: 70,
		numSeats: 12,
		members: []
	},
	9: {
		x: 372,
		y: 312,
		width: 70,
		height: 70,
		numSeats: 12,
		members: []
	},
	10: {
		x: 371,
		y: 478,
		width: 70,
		height: 70,
		numSeats: 12,
		members: []
	},
	11: {
		x: 450,
		y: 180,
		width: 70,
		height: 70,
		numSeats: 12,
		members: []
	},
	12: {
		x: 450,
		y: 264,
		width: 70,
		height: 70,
		numSeats: 12,
		members: []
	},
	13: {
		x: 450,
		y: 348,
		width: 70,
		height: 70,
		numSeats: 12,
		members: []
	},
	14: {
		x: 450,
		y: 430,
		width: 70,
		height: 70,
		numSeats: 12,
		members: []
	}
};
var guests = [];

function renderTableBoxes() {
	var $overlay = $('#layoutOverlay'),
		$reference = $('#reference'),
		$tableBox;
	$overlay.css({'height': $reference.height(), 'width': $reference.width()});
	$overlay.position({
		my: 'top left',
		at: 'top left',
		of: $reference
	});
	$.each(tables, function(i, table) {
		$tableBox = $('<div/>', {
			'class': 'table-box',
			'id': 'table-' + i,
			'data-table': + i
		}).appendTo($overlay);
		$tableBox.css({
			'position': 'absolute',
			//'border': '1px solid red',
			'top': table.y + 'px',
			'left': table.x + 'px',
			'width': table.width + 'px',
			'height': table.height + 'px'
		});
	});
}

function initHandlers() {
	$('.table-box')
		.off('click')
		.on('click', function(e) {
		var $target = $(e.target),
			tableNum = $target.data('table'),
			table = tables[tableNum],
			$popup = $('#tablePopup');
		e.stopPropagation();

		$popup.data('table', tableNum);
		$popup.find('h4').text('Table ' + tableNum);
		if (table.members.length) {
			$popup.find('section').html(renderTableMembers(table.members));
		}
		$popup
			.toggleClass('empty-table', !table.members.length)
			.toggleClass('full-table', table.members.length === table.numSeats);
		$popup.fadeIn('fast', function() {
			$(this).position({
				my: 'center',
				at: 'center',
				collision: 'fit fit',
				of: $target
			});
			renderUnseatedGuestList();
		});
	});
	$('#addToTable')
		.off('click')
		.on('click', function(e) {
		var $popup = $('#tablePopup'),
			tableId = $popup.data('table'),
			table = tables[tableId],
			selectedGuest = $('#guestSelect').val();
		e.stopPropagation();
		guests[selectedGuest].table = tableId;
		table.members.push(guests[selectedGuest]);
		$popup
			.toggleClass('empty-table', !table.members.length)
			.toggleClass('full-table', table.members.length === table.numSeats);

		$popup.find('section').html(renderTableMembers(table.members));
		renderUnseatedGuestList();
		update();
	})
	$(document)
		.off('click')
		.on('click', function(e) {
		var $popup = $('#tablePopup'),
			$target = $(e.target);
		if (!$target.closest('#tablePopup').length &&
			!$target.is('#tablePopup')) {
			if ($popup.is(':visible')) {
				$popup.hide();
			}
		}
	});
	$('#tablePopup')
		.off('click')
		.on('click', '.remove-link', function(e) {
		var guestId = $(e.target).parent().data('guest'),
			$popup = $('#tablePopup')
			tableId = $popup.data('table'),
			table = tables[tableId],
			memberArray = [];
		e.preventDefault();
		$(e.target).parent().fadeOut('fast', function() {
			this.remove();
			guests[guestId].table = null;
			for (var i = 0; i < table.members.length; i++) {
				if (table.members[i].id !== guestId) {
					memberArray.push(table.members[i]);
				}
			}
			table.members = memberArray;
			$popup
				.toggleClass('empty-table', !table.members.length)
				.toggleClass('full-table', table.members.length === table.numSeats);
			renderUnseatedGuestList();
			update();
		});
	});
}

function renderUnseatedGuestList() {
	var $selectMenu = $('#guestSelect');
	$selectMenu.empty();
	$.each(getUnseatedGuests(), function(i, guest) {
		var $guestOption = $('<option/>', {
			'value': guest.id
		});
		$guestOption.attr('data-guest', guest.id);
		$guestOption.text(guest.name);
		$guestOption.attr('title', guest.description);
		$guestOption.appendTo($selectMenu);
	});
}

function renderTableMembers(members) {
	var $memberList = $('.member-list[data-template]').clone().removeAttr('data-template'),
		$memberItem;
	$.each(members, function(i, member) {
		$memberItem = $('<div/>', {
			'class': 'guest',
			'data-guest': member.id
		}).text(member.name);
		$memberItem.data('member', member);
		$memberItem.attr('title', member.description);
		$('<a/>', {
			'href': '#',
			'class': 'remove-link'
		}).text('Remove').appendTo($memberItem);
		$memberItem.appendTo($memberList);
	});
	return $memberList;
}

function parseGuestList(content) {
	var lines = content.split('\r\n'),
		guestArray = [],
		guestParts,
		guest;

	$.each(lines, function(i, guestLine) {
		guestParts = guestLine.split(',');
		guest = {
			id: i,
			name: guestParts[0],
			description: guestParts[1],
			table: (guestParts.length > 2) ? guestParts[2] : null
		}
		guestArray.push(guest);
	});
	return guestArray;
}

function getUnseatedGuests() {
	var unseatedGuests = [];
	for (var i = 0; i < guests.length; i++) {
		if (!guests[i].table) {
			unseatedGuests.push(guests[i]);
		}
	}
	return unseatedGuests;
}

function getGuestsNotSeatedAtTable(tableId) {
	var otherGuests = [];
	for (var i = 0; i < guests.length; i++) {
		if (guests[i].table && guests[i].table !== tableId) {
			otherGuests.push(guests[i]);
		}
	}
	return otherGuests;
}

function update() {
	updateStatistics();
	updateExportUrl();
}

function updateStatistics() {
	var seatedCount = 0;
	$('#guestCount').text(guests.length);
	$.each(tables, function(i, table) {
		seatedCount += table.members.length;
	});
	$('#seatedCount').text(seatedCount);
}

function updateExportUrl() {
	var seatingChart ='',
			csvContent;
	$.each(guests, function(i, guest) {
		seatingChart += guest.name + ',' + guest.description + (guest.table ? ',' + guest.table : '');
		seatingChart += (i < guests.length) ? '\r\n' : '';
	});
	csvContent = 'data:text/csv;charset=utf-8,' + seatingChart;
	$('#export').attr({
		'href': encodeURI(csvContent),
		'download': 'Wedding Seating Chart.csv'
	});
}

function loadTableAssignments() {
	$.each(guests, function(i, guest) {
		if (guest.table && tables[guest.table] &&
			tables[guest.table].members.length < tables[guest.table].numSeats) {
			tables[guest.table].members.push(guest);
		}
	});
}

function initialize() {
	update();
	renderTableBoxes();
	initHandlers();
}

$('#guestListFile').on('change', function (e) {
	var files = e.target.files,
		fileReader = new FileReader();
	fileReader.onload = function() {
		guests = parseGuestList(fileReader.result);
		loadTableAssignments();
		initialize();
	};
	fileReader.readAsText(files[0]);
});

$(window).on('resize', initialize);

/* Read from local file without import
$.get('./Wedding Guest List.csv', function(data) {
	guests = parseGuestList(data);
	loadTableAssignments();
	updateStatistics();
	renderTableBoxes();
	initHandlers();

	console.log(guests.length);
}, 'text');*/

