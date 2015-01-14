/**
 * Created by cellis on 10/13/14.
 */

module.exports = User;

function User(obj) {
    this._id = obj && obj._id || undefined;
    this.name = obj && obj.name || "" ;
    this.email = obj && obj.email || "";
}


