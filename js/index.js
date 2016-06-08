var boxList = document.getElementById('boxList');
var page = document.getElementById('page');
var pageList = document.getElementById('pageList');
var oLi = pageList.getElementsByTagName('li');
var pageInput = document.getElementById('pageInput');
var n = 1, totalPage = 0;

bindHTML();
function bindHTML() {
    function callback(jsondata) {
        var total = jsondata['total'], data = jsondata['data'];
        totalPage = total;
        var str = '';
        for (var i = 0; i < data.length; i++) {
            var curData = data[i];
            var sex = curData['sex'] === 1 ? '女' : '男';
            str += '<li>';
            str += '<span>' + curData['num'] + '</span>';
            str += '<span>' + curData['name'] + '</span>';
            str += '<span>' + sex + '</span>';
            str += '<span>' + curData['score'] + '</span>';
            str += '</li>';
        }
        boxList.innerHTML = str;

        if (pageList.innerHTML == '') {
            str = '';
            for (i = 1; i <= total; i++) {
                if (i === 1) {
                    str += '<li class="bg">' + i + '</li>';
                    continue;
                }
                str += '<li>' + i + '</li>';
            }
            pageList.innerHTML = str;
        }

        for (var j = 0; j < oLi.length; j++) {
            oLi[j].className = j == (n - 1) ? 'bg' : null;
        }
        pageInput.value = n;
    }

    var xhr = new XMLHttpRequest;
    xhr.open('get', '/getData?n=' + n + '&_=' + Math.random(), true);
    xhr.onreadystatechange = function () {
        if (xhr.readyState === 4 && xhr.status === 200) {
            callback(JSON.parse(xhr.responseText))
        }
    };
    xhr.send(null);
}

page.onclick = function (e) {
    e = e || window.event;
    var tar = e.target || e.srcElement, tarTag = tar.tagName.toUpperCase();
    if (tarTag === 'SPAN') {
        if (tar.innerHTML == '首页') {
            if (n === 1) {
                return;
            }
            n = 1;
        }
        if (tar.innerHTML == '上一页') {
            if (n === 1) {
                return;
            }
            n--;
        }
        if (tar.innerHTML == '下一页') {
            if (n === totalPage) {
                return;
            }
            n++;
        }
        if (tar.innerHTML == '尾页') {
            if (n === totalPage) {
                return;
            }
            n = totalPage;
        }
        bindHTML();
    }
    if (tarTag === 'LI') {
        var tempN = parseFloat(tar.innerHTML);
        if (tempN == n) {
            return;
        }
        n = tempN;
        bindHTML();
    }
};

pageInput.onkeyup = function (e) {
    e = e || window.event;
    if (e.keyCode == '13') {
        var num = Number(this.value.replace(/^ +| +$/g, ''));
        if (isNaN(num)) {
            this.value = n;
            return;
        }
        if (num == n) {
            this.value = n;
            return;
        }
        if (num < 1) {
            this.value = 1;
            n = 1;
        } else if (num > totalPage) {
            this.value = totalPage;
            n = totalPage;
        } else {
            n = num;
        }
        bindHTML();
    }
};





