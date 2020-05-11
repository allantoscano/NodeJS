const repository = require("../repositories/order-repository");
const guid = require("guid");
const authService = require("../services/auth-service");

exports.get = async (req, res, next) => {
  try {
    const data = await repository.get();

    return res.status(200).send(data);
  } catch (e) {
    res.status(500).send({
      message: "Fala ao processar sua requisição.",
    });
  }
};

exports.post = async (req, res, next) => {
  try {
    //Recupera o token
    const token = req.headers["bearer"];

    //Decodifica o token
    const data = await authService.decodeToken(token);

    await repository.create({
      ...req.body,
      customer: data.indexOf,
      number: guid.raw().substring(0, 6),
    });

    res.status(201).send({
      message: "Pedido cadastrada com sucesso!",
    });
  } catch (e) {
    res.status(500).send({
      message: "Falha ao processar sua requisição",
      data: e,
    });
  }
};
