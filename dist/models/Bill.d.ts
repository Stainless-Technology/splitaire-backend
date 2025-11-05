import mongoose from 'mongoose';
import { IBill } from '../types';
declare const Bill: mongoose.Model<IBill, {}, {}, {}, mongoose.Document<unknown, {}, IBill, {}, {}> & IBill & Required<{
    _id: mongoose.Types.ObjectId;
}> & {
    __v: number;
}, any>;
export default Bill;
//# sourceMappingURL=Bill.d.ts.map