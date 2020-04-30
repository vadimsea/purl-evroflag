var currentDesign = 1;
var currentTab = 1;
var zoom = 4;
var tabCount = 4;

function toggleMenuGroup(el) {
    let el2 = el.nextElementSibling;

    if (el2.style.display === '')
        el2.style.display = 'none'
    else
        el2.style.display = el2.style.display === 'none' ? 'block' : 'none'
}

function changeDesign(d) {
    document.getElementById("descriptionDiv").innerHTML = descriptionDivContent[d];
    document.getElementById("description2Div").innerHTML = description2DivContent[d];

    //document.getElementById('price').innerText =
        //designPrices[d - 1];
        //formatCents(designPrices[d - 1]) + '*';

    document.getElementById(
        "tab-content-" + currentDesign + "-" + currentTab).style.display = "none";

    //document.getElementById('d').value = designIds[d - 1];

    stopPlayingCurrentVideo(d, currentTab);

    currentDesign = d;

    var designLinks = document.querySelectorAll('.menu-left ul li a');

    for (var i = 0; i < designLinks.length; i++)
    {
        if (i + 1 == d)
        {
            if (designLinks[i].className.indexOf('selected') === -1)
            {
                designLinks[i].className = designLinks[i].className.trim() + " selected";
            }
        }
        else
        {
            designLinks[i].className = designLinks[i].className.replace(/\bselected\b/g, "");
        }
    }

    changeTab(currentTab);

    findMainImage();
    onMainImageChange();
}

function changeTab(tab)
{
    for (var i = 1; i <= tabCount; i++)
    {
        document.getElementById(
            "tab-content-" + currentDesign + "-" + i).style.display = "none";
        document.getElementById(
            "tab" + i).className = "";
    }

    document.getElementById(
        "tab-content-" + currentDesign + "-" + tab).style.display = "block";
    document.getElementById(
        "tab" + tab).className = "active";

    stopPlayingCurrentVideo(currentDesign, tab);

    currentTab = tab;

    if (tab == 1 || tab == 3)
    {
        magnifier.style.visibility = '';
    }
    else
    {
        magnifier.style.visibility = 'hidden';
    }

    if (tab == 1)
    {
        document.querySelector('.information-two').style.display = '';
        document.querySelector('.information-two-for-all-tabs').style.display = 'none';
    }
    else
    {
        document.querySelector('.information-two').style.display = 'none';
        document.querySelector('.information-two-for-all-tabs').style.display = '';
    }

    findMainImage();
    onMainImageChange();
}

function stopPlayingCurrentVideo(d, tab) {
    if ((currentDesign != d || currentTab != tab) && currentTab == 4)
    {
        var el = document.getElementById("tab-content-" + currentDesign + "-" + currentTab);
        el.innerHTML = el.innerHTML;
    }
}

function onMainImageChange() {
    var imageLink = mainImage.src;

    var srcImageLink = imageLink;

    /*if (isImageCached(srcImageLink))
    {
        magnifier.style.backgroundImage = "url('" + srcImageLink + "')";
    }
    else
    {
        magnifier.style.backgroundImage = "url('" + imageLink + "')";
        loadSrcImage(imageLink);
    }*/

    magnifier.style.backgroundImage = "url('" + srcImageLink + "')";
}

function isImageCached(imageUrl){
    var imgEle = document.createElement("img");
    imgEle.src = imageUrl;
    return imgEle.complete || (imgEle.width+imgEle.height) > 0;
}

loadedImages = {};

function loadSrcImage(imageLink) {
    var srcImageLink = imageLink;

    loadingImage = new Image();
    loadingImage.onload = function() {
        var bkgnd = mainImage.src;
        bkgnd = bkgnd;
        if (bkgnd == loadingImage.src)
        {
            magnifier.style.backgroundImage = "url('" + bkgnd + "')";
        }

        loadedImages[this.src] = new Image();
        loadedImages[this.src].src = this.src;

        if (typeof imagesForLoad === 'undefined')
            return;

        removeFromArray(imagesForLoad);

        if (imagesForLoad.length > 0)
        {
            loadSrcImage(imagesForLoad[0]);
        }
    }
    loadingImage.onerror = function()
    {
        if (typeof imagesForLoad === 'undefined')
            return;

        removeFromArray(imagesForLoad, this.src);

        if (imagesForLoad.length > 0)
        {
            loadSrcImage(imagesForLoad[0]);
        }
    }
    loadingImage.src = srcImageLink;
}

function removeFromArray(arr, what) {
    for (var i = 0; i < arr.length; i++)
    {
        if (arr[i] === what)
        {
            arr.splice(i, 1);
            i--;
        }
    }
}

function findMainImage() {
    mainImage = document
        .getElementById('tab-content-' + currentDesign + '-' + currentTab)
        .getElementsByClassName("main-image")[0]
        .getElementsByTagName( 'img' )[0];
}

function changeMainImage(img)
{
    if (typeof mainImage === "undefined")
    {
        findMainImage();
    }

    mainImage.src = img.src;

    onMainImageChange();
}

Date.isLeapYear = function (year) {
    return (((year % 4 === 0) && (year % 100 !== 0)) || (year % 400 === 0));
};

Date.getDaysInMonth = function (year, month) {
    return [31, (Date.isLeapYear(year) ? 29 : 28), 31, 30, 31, 30, 31, 31, 30, 31, 30, 31][month];
};

Date.prototype.getDaysInMonth = function () {
    return Date.getDaysInMonth(this.getFullYear(), this.getMonth());
};

Date.prototype.addMonths = function (value) {
    var n = this.getDate();
    this.setDate(1);
    this.setMonth(this.getMonth() + value);
    this.setDate(Math.min(n, this.getDaysInMonth()));
    return this;
};

function updatePaymentInfoTotal()
{
    //var mainInfoElement = document.getElementById('total_main_info');
    var additionalInfoElement = document.getElementById('total_additional_info');

    var months = document.getElementById('b_pay_option').value;

    var todayPayment = Math.floor(designCentPrice / months);
    var todayPaymentFormatted =
        formatCents(todayPayment);

    var today  = new Date();
    var lastPaymentDate = today.addMonths(months - 1);
    var lastPaymentDateFormatted = lastPaymentDate.toLocaleDateString("en-US");

    additionalInfoElement.innerHTML =
        '<p>Today’s Payment: ' + todayPaymentFormatted +
        '</p><p>Total Payments: ' + months +
        '</p><p>Last Payment on: ' + lastPaymentDateFormatted +
        '</p>';
}

function formatCents(cents)
{
    var result = (cents / 100).toLocaleString("by-BY", {style:"currency", currency:"BYN"});
    result = result.replace(/,00/g, '');
    return result;
}

String.prototype.replaceLast = function (what, replacement) {
    var pcs = this.split(what);
    var lastPc = pcs.pop();
    return pcs.join(what) + replacement + lastPc;
};

function initMagnifier() {

    if (window.matchMedia("(max-width: 480px)").matches)
    {
        return;
    }

    findMainImage();
    //getImagesForLoad();
    createMagnifier();
    loadSrcImage(mainImage.src);
    createMesh();
    initEvents();

    function initEvents() {
        var imgs = document.querySelectorAll('.main-image img');

        for (var i = 0; i < imgs.length; i++)
        {
            var e = imgs[i];

            e.addEventListener("mousemove", onCursorMove);
            e.addEventListener("touchmove", onCursorMove);

            e.addEventListener("mouseenter", onEnter);
            e.addEventListener("touchstart", onEnter);

            e.addEventListener("mouseleave", onLeave);
            e.addEventListener("touchend", onLeave);
            e.addEventListener("touchcancel", onLeave);
        }

        mesh.addEventListener("mousemove", onCursorMove);
        mesh.addEventListener("touchmove", onCursorMove);

        mesh.addEventListener("mouseenter", onEnter);
        mesh.addEventListener("touchstart", onEnter);

        mesh.addEventListener("mouseleave", onLeave);
        mesh.addEventListener("touchend", onLeave);
        mesh.addEventListener("touchcancel", onLeave);
    }

    function onCursorMove(e) {
        e.preventDefault();
        updateMagnifierAndMesh(e);
    }

    function onEnter(e) {
        recalcMagnifierSize(e);
        updateMagnifierAndMesh(e);
        magnifier.style.display = '';
        mesh.style.display = '';
    }

    function onLeave(e) {
        var goingTo = e.relatedTarget || event.toElement;

        if (goingTo === mesh || goingTo === mainImage)
            return;
        magnifier.style.display = 'none';
        mesh.style.display = 'none';
    }

    function updateMagnifierAndMesh(e) {
        var cPos = getCursorPos(e);

        var magnifierRect = magnifier.getBoundingClientRect();
        var mainImageRect = mainImage.getBoundingClientRect();
        var mainImageDivRect = mainImage.parentElement.getBoundingClientRect();

        var zoomedImageWidth = mainImageRect.width * zoom;
        var zoomedImageHeight = mainImageRect.height * zoom;

        var meshWidth = mainImageRect.width * magnifierRect.width / zoomedImageWidth;
        var meshHeight = mainImageRect.height * magnifierRect.height / zoomedImageHeight;

        var meshPosX = cPos.x - meshWidth / 2;
        var meshPosY = cPos.y - meshHeight / 2;

        meshPosX = Math.max(meshPosX, 0);
        meshPosY = Math.max(meshPosY, 0);

        var meshPosXMax = mainImageRect.width - meshWidth;
        var meshPosYMax = mainImageRect.height - meshHeight;

        meshPosX = Math.min(meshPosX, meshPosXMax);
        meshPosY = Math.min(meshPosY, meshPosYMax);

        var meshPosXAdjusted = meshPosX +
            (mainImageDivRect.width - mainImageRect.width) / 2;
        var meshPosYAdjusted = meshPosY +
            (mainImageDivRect.height - mainImageRect.height) / 2;

        meshPosYAdjusted += mainImage.parentElement.offsetTop;

        mesh.style.width = meshWidth + 'px';
        mesh.style.height = meshHeight + 'px';

        mesh.style.left = meshPosXAdjusted + 'px';
        mesh.style.top = meshPosYAdjusted + 'px';

        magnifier.style.backgroundSize =
            zoomedImageWidth + "px " + zoomedImageHeight + "px";

        var x = zoomedImageWidth * meshPosX / mainImageRect.width;
        var y = zoomedImageHeight * meshPosY / mainImageRect.height;

        magnifier.style.backgroundPosition =
            "-" + x + "px -" + y + "px";
    }

    function recalcMagnifierSize(e)
    {
        var magnifierMaxWidth = 620;
        var magnifierMaxHeight = 620;

        var mainImageRect = mainImage.getBoundingClientRect();
        var magnifierRect = magnifier.getBoundingClientRect();

        // Hack for IE
        if (magnifierRect.height === 0)
        {
            var d = magnifier.style.display;
            magnifier.style.display = '';
            magnifierRect = magnifier.getBoundingClientRect();
            magnifier.style.display = d;
        }

        var w1 = mainImageRect.width * zoom;
        var h1 = mainImageRect.height * zoom;

        var w2 = Math.max(document.documentElement.clientWidth, window.innerWidth || 0)
            - magnifierRect.left - 20;
        w2 = Math.max(w2, 200);

        var h2 = Math.max(document.documentElement.clientHeight, window.innerHeight || 0)
            - magnifierRect.top - 20;
        h2 = Math.max(h2, 200);

        var h = Math.min(h1, h2, magnifierMaxHeight);
        var w = Math.min(w1, w2, magnifierMaxWidth);

        magnifier.style.width = w + 'px';
        magnifier.style.height = h + 'px';
    }

    function getCursorPos(e) {
        var a, x = 0, y = 0;
        e = e || window.event;
        /*get the x and y positions of the image:*/
        a = mainImage.getBoundingClientRect();
        /*calculate the cursor's x and y coordinates, relative to the image:*/
        x = e.pageX - a.left;
        y = e.pageY - a.top;
        /*consider any page scrolling:*/
        x = x - window.pageXOffset;
        y = y - window.pageYOffset;
        return {x : x, y : y};
    }

    function createMagnifier() {
        magnifier = document.createElement('DIV');
        magnifier.setAttribute('class', 'magnifier');
        magnifier.id = 'magnifier';
        magnifier.style.display = 'none';
        magnifier.style.width = '100px';
        magnifier.style.height = '100px';
        magnifier.style.top = mainImage.parentElement.offsetTop + 'px';
        magnifier.style.backgroundRepeat = "no-repeat";
        magnifier.style.backgroundImage = "url('" + mainImage.src + "')";

        var tabDiv = document.querySelector('.tab-content');
        tabDiv.parentElement.insertBefore(magnifier, tabDiv);
    }

    function createMesh() {
        mesh = document.createElement('DIV');
        mesh.setAttribute('class', 'mesh');
        mesh.id = 'mesh';
        mesh.style.display = 'none';
        mesh.style.width = '100px';
        mesh.style.height = '100px';
        mesh.style.top = mainImage.parentElement.offsetTop + 'px';

        var tabDiv = document.querySelector('.tab-content');
        tabDiv.parentElement.insertBefore(mesh, tabDiv);
    }

    function getImagesForLoad() {
        var imgs = document.querySelectorAll('.item-mini-image img');
        imagesForLoad = [];
        for (var i = 0; i < imgs.length; i++)
        {
            imagesForLoad[i] = imgs[i].src;
        }
    }
}
