// remove the scanner and port when the mouse leaves and show when the mouse comes in
// bring in the thumbnails
// allow the user to load other images dynamically

$(document).ready( function() {
    const ratioHolders = {imgWidthRatio: 1, imgHeightRatio: 1 }

    const resizeTheWindowScannerAndPort = () => {
        let imgParentWidth = $('.imgHold').outerWidth(), // parent cover of the image of the left 
            winWidth = $(window).innerWidth(), // current window width
            winHeight = $(window).outerHeight(), // current window height
            portWidth = winWidth - imgParentWidth, // we want the port width to be the remain window space
            portHeight = winHeight, // port height = current window height
            scannerWidth = portWidth / 4, // we want the scanner width to be proportional to the port width
            scannerHeight = portHeight / 4, // we want the scanner height to be proportional to the port height
            img = $('.img_2 img'),
            imgWidth = img.width(), // the main image width
            imgHeight = img.height(), // the main image height
            imgWidthRatio = Number((imgWidth / scannerWidth).toFixed(2)),  // the ratio of the image to the scanner, i.e how many times is the image wider than the scanner width
            imgHeightRatio = Number((imgHeight / scannerHeight).toFixed(2)) - 0.5; // the ratio of the image height to the scanner, i.e how many times is the image longer than the scanner height.. you can remove the 0.5, i added because the top of the image port was not given me what i wanted, the port still works very well without it

        // update the width and height of the port to match the width and height
        $('.imgMainViewerCover').css({'width':`${portWidth - 20}px`, 'height':`${portHeight - 10}px`})

        // we update the scanner width and height to the same size as the port, but we used the ratio to reduce the width and height by 4times
        $('.scanner').css({'width': `${scannerWidth}px`, 'height': `${scannerHeight}px`})

        // we use the ratio of how many times the main image is larger than our scanner, since the scanner and the port and the same size, we want the image in the
        // port to be larger than the port with the same ratio
        $('.imgViewerWindow').css({'width': `${imgWidthRatio * portWidth}px`})

        // we update the ratios of the image-width to the scanner-width, i.e how many times the image is larger than the scanner
        // we update the ratios of the image-height to the scanner-height, i.e how many times the image is longer than the scanner
        Object.assign(ratioHolders, {imgWidthRatio, imgHeightRatio});
    }

    $('body').on('mousemove', 'div.imgHold', function (event) {
        let imgParent = $('.imgHold'),
            img = $('.img_2 img'),
            imgWidth = img.width(),
            imgHeight = img.height(),
            imgLeft = img.offset().left,
            imgPosition = img.position(),
            scanner = $('.scanner'),
            scannerWidth = scanner.width(),
            scannerHeight = scanner.height(),
            scannerPosition = scanner.position(), // the scanner position relative to the parent
            my = event.pageY - img.offset().top - (scannerHeight / 4), // we reset the mouse position from the top, the scanner position is absolute, relative to the parent, so if you give it a mouse postion from the top, it'll go further down
            mx = event.pageX - (scannerWidth / 2), // we want the cursor to always be at the middle of the scanner, if you take away the (scanner/2), you'll see the difference
            uTop = my,
            uLeft = mx,
            imgTotHeight = imgHeight + img.offset().top, // total height of the image from the top (image height + distance of the image from top of the window document )
            uleftAndScannerWidth = uLeft+scannerWidth, // mouse position from the left + the width of the scanner
            totImgWidth = imgWidth+imgLeft, // the total width of the image + the distance of the image from the left of the window document
            uFromTop = uTop + imgParent.offset().top + scannerHeight,
            parentHeight = $('.imgHold').height() + $('.imgHold').offset().top,
            uBottom = parentHeight - imgTotHeight;

        // fixes the top corner not to overflow from the screen
        if (uTop < imgPosition.top) { uTop = imgPosition.top; }

        // fixes the left conner not to overflow from the screen
        if (scannerPosition.left < imgLeft || uLeft < imgLeft) { uLeft = imgLeft; }

        // fixing the right conner not to overflow from the screen
        if (uleftAndScannerWidth > totImgWidth) { uLeft = totImgWidth - scannerWidth; }

        // fixes the bottom corner not to overflow from the screen
        if (uFromTop > imgTotHeight) { uTop = `auto`; uBottom = `${uBottom}px`; } else { uTop = `${uTop}px`; uBottom = `auto`; }

        // we set the position of the scanner to correspond with the position of the mouse
        $('.scanner').css({'left': `${uLeft}px`, 'top': uTop, 'bottom':uBottom})

        // 1. we get the percentage of how far from the top is the scanner
        // 2. we get the percentage of how far from the left is the scanner
        let topPercent = (scannerPosition.top*100)/imgHeight;
        let leftPercent = ((scannerPosition.left - imgLeft)*100)/imgWidth;

        // we use the percentage and the ratio to adjust the port position to show the zoomed effect of the image
        $('.imgViewerWindow').css({'top':`-${topPercent * ratioHolders.imgHeightRatio}%`, 'left':`-${leftPercent *  ratioHolders.imgWidthRatio}%`});
    })

    // anytime the window resizes, we want to update the width and height of the port and the scanner
    $(window).resize(() => { resizeTheWindowScannerAndPort(); })

    // updates the width and height of the port and scanner on page load
    resizeTheWindowScannerAndPort();
})