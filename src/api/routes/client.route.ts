import express, { Request, Response } from "express";
import Address from "../../modules/@shared/domain/value-object/address";
import ClientAdmFacadeFactory from "../../modules/client-adm/factory/client-adm.facade.factory";

export const clientRoute = express.Router();

clientRoute.post("/", async (req: Request, res: Response) => {
  const facade = ClientAdmFacadeFactory.create();

  try {
    const clientDto = {
      name: req.body.name,
      email: req.body.email,
      document: req.body.document,
      address: new Address(
        req.body.address.street,
        req.body.address.number,
        req.body.address.complement,
        req.body.address.city,
        req.body.address.state,
        req.body.address.zipCode,
      )
    };

    const output = await facade.add(clientDto);
    res.send(output);
  } catch (err) {
    res.status(500).send(err);
  }
});