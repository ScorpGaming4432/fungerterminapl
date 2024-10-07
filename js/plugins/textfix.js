(function() {

    var dir = window.location.pathname.substring(0, window.location.pathname.lastIndexOf('/'));
    Graphics.loadFont("StandardFont", dir + "/fonts/" + "mplus-1m-regular.ttf");

    //Use the mplus-1m-refular.ttf font for Window_NameEdit
    Window_NameEdit.prototype.standardFontFace = function() {
        return "StandardFont";
    };


    /*
    //Un-comment this section if you want the Input window to also use the standard font

    //Use the mplus-1m-refular.ttf font for Window_NameInput
    Window_NameInput.prototype.standardFontFace = function() {
        return "StandardFont";
    };
    */


    /*
    // Un-comment this section if you want SRD's explanation window to also use the standard font

    //Use the mplus-1m-refular.ttf font for Window_NameExplanation
    Window_NameExplanation.prototype.standardFontFace = function() {
        return "StandardFont";
    };
    */

})();