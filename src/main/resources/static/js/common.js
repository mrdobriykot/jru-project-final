let form;

function makeEditable(datatableOpts) {
    ctx.datatableApi = $("#datatable").DataTable(
        // https://api.jquery.com/jquery.extend/#jQuery-extend-deep-target-object1-objectN
        $.extend(true, datatableOpts,
            {
                "ajax": {
                    "url": ctx.ajaxUrl,
                    "dataSrc": ""
                },
                "paging": true,
                "info": true,
                "language": {
                    "search": "Search",
                    "ru": "Поиск"
                }
            }
        ));
    form = $('#detailsForm');

    $(document).ajaxError(function (event, jqXHR) {
        failNoty(jqXHR);
    });

    // solve problem with cache in IE: https://stackoverflow.com/a/4303862/548473
    $.ajaxSetup({cache: false});
}

function add() {
    $('#modalTitle').html('Add ' + ctx.pageName);
    form.find(":input").val("");
    $('#editRow').modal('show');
}

function updateRow(id) {
    const find = form.find(":input").val("");
    $("#modalTitle").html('Edit ' + ctx.pageName);
    fillTaskModal(id, find);
}

function fillTaskModal(id, form) {
    $.get(ctx.ajaxUrl + '/' + id, function (data) {
        $.each(data, function (key, valueKey) {
            let line = form[key];
            if (line) {
                line.value = valueKey;
            }
            if (line != null && line.type === 'checkbox') {
                line.checked = valueKey;
            }
        });
        $('#editRow').modal('show');
    });
}

function deleteRow(id) {
    if (confirm("Are you sure?")) {
        $.ajax({
            url: ctx.ajaxUrl + '/' + id,
            type: "DELETE"
        }).done(function () {
            updateTable();
            successNoty("Record deleted");
        });
    }
}

function updateTable() {
    $.get(ctx.ajaxUrl, el => {
        ctx.datatableApi.clear().rows.add(el).draw();
    })
}

function save() {
    $.ajax({
        type: "POST",
        url: ctx.ajaxUrl + '/form',
        data: form.serialize()
    }).done(function () {
        $("#editRow").modal('hide');
        updateTable()
        successNoty("Record saved");
    });
}

let failedNote;

function closeNoty() {
    if (failedNote) {
        failedNote.close();
        failedNote = undefined;
    }
}

function successNoty(key) {
    closeNoty();
    new Noty({
        text: "<span class='fa fa-lg fa-check'></span> &nbsp;" + key,
        type: 'success',
        layout: "bottomRight",
        timeout: 1000
    }).show();
}

function renderEditBtn(data, type, row) {
    if (type === "display") {
        return "<a onclick='updateRow(" + row.id + ");'><span class='fa fa-pencil'></span></a>";
    }
}

function renderDeleteBtn(data, type, row) {
    if (type === "display") {
        return "<a onclick='deleteRow(" + row.id + ");'><span class='fa fa-remove'></span></a>";
    }
}

function failNoty(jqXHR) {
    closeNoty();
    var errorInfo = jqXHR.responseJSON;
    failedNote = new Noty({
        text: "<span class='fa fa-lg fa-exclamation-circle'></span> &nbsp;" + errorInfo.title + "<br>" +
        errorInfo.invalid_params ? JSON.stringify(errorInfo.invalid_params) : errorInfo.detail,
        type: "error",
        layout: "bottomRight"
    });
    failedNote.show()
}
