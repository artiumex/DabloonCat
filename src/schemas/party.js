const { Schema, model } = require('mongoose');
const about = require('../universal/aboutParties');

const partySchema = new Schema({
    _id: Schema.Types.ObjectId,
    name: String,
    id: String,
    description: String,
    members: {
        type: Map,
        of: String
    },
    share_loot: { type: Boolean, default: true },
}, {
    virtuals: {
        memberList: {
            get() {
                return (Array.from(this.members.keys())).map(e => {
                    const role_raw = this.members.get(e);
                    return {
                        id: e,
                        role: about.roles[role_raw],
                        role_raw: role_raw,
                    }
                })
            }
        },
        roles: {
            get() {
                const output = new Map();
                const mList = []
                const notMembers = (Object.keys(about.roles)).slice(0,-1);
                for (const m of this.memberList) {
                    if (m.role_raw == "member") {
                        mList.push(m.id);
                    } else {
                        for (const r of notMembers) {
                            if (m.role_raw == r) output.set(r, m.id);
                        }
                    }
                }
                output.set("members", mList);
                return output
            }
        },
    }
});

module.exports = model("Party", partySchema, "parties");