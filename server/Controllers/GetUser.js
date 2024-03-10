import { FirModel } from "../Schema/FirSchema.js";

export const Getuser = (req, res) => {

    FirModel.find().then((data) => {
        res.send({
            status: 200,
            message: "User found",
            data: data,
        });
    }).catch((err) => {
        res.send(err);
    })
};
