/**
 * Created by cellis on 10/13/14.
 */

module.exports = Doc;

function Doc() {
    this.name = "";  //"lafayette.com-publicart"
    this.org = "orgid";
    this.viewApps = {}  //apps that can see this data, view apps can edit their appspace
    this.editApps = {};  //apps that can edit the core data
}

