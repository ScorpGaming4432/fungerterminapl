 /*:
 * @plugindesc v1.0 Removes the Luck stat from Yep_EquipCore
 * @author Toby Yasha
 *
 * @help
 * 
 * No Credit Needed!
 *
*/


Window_StatCompare.prototype.refresh = function() {    
this.contents.clear();
if (this._actor) {      
this.drawItem(0, this.lineHeight() * 0, 0);
this.drawItem(0, this.lineHeight() * 1, 1);
this.drawItem(0, this.lineHeight() * 2, 2);   
this.drawItem(0, this.lineHeight() * 3, 3);
this.drawItem(0, this.lineHeight() * 4, 4);
this.drawItem(0, this.lineHeight() * 5, 5);
this.drawItem(0, this.lineHeight() * 6, 6);
}};
