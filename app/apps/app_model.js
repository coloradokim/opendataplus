/**
 * Created by cellis on 10/13/14.
 */

module.exports = App;

function App(obj) {
    this._id = obj && obj._id || undefined;
    this.name = obj && obj.name || "" ;
    this.description = obj && obj.description || "";
    this.email = obj && obj.email || "";
    this.owner = obj && obj.owner || "";
}

