/**
 * Created by cellis on 1/13/15.
 */

module.exports = Doc_Metadata;

function Doc_Metadata() {
    this.lastUpdateTS = new Date();
    this.user = "";
    this.createdTS = new Date();
    this.history = {};
}

