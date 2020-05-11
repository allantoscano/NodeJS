const ValidationContract = require("../validators/fluent-validator");
const repository = require("../repositories/customer-repository");
const md5 = require("md5");
const emailService = require("../services/email-service");
const authService = require("../services/auth-service");

exports.authenticate = async (req, res, next) => {
  try {
    const customer = await repository.authenticate({
      email: req.body.email,
      password: md5(req.body.password + global.SALT_KEY),
    });

    if (!customer) {
      res.status(404).send({
        message: "Usuário ou senha inválidos.",
      });

      return;
    }

    const token = await authService.generateToken({
      id: customer._id,
      email: customer.email,
      name: customer.name,
    });

    res.status(201).send({
      token: token,
      data: {
        email: customer.email,
        name: customer.name,
      },
    });
  } catch (e) {
    res.status(500).send({
      message: "Falha ao processar sua requisição",
    });
  }
};

exports.get = async (req, res, next) => {
  try {
    const data = await repository.get();

    res.status(200).send(data);
  } catch (e) {
    res.status(500).send({
      message: "Falha ao processar sua requisição",
      data: e,
    });
  }
};

exports.post = async (req, res, next) => {
  try {
    let contract = new ValidationContract();

    contract.hasMinLen(
      req.body.name,
      3,
      "O nome deve conter pelo menos 3 caracteres."
    );

    contract.isEmail(req.body.email, "E-mail inválido.");

    contract.hasMinLen(
      req.body.password,
      6,
      "O password deve conter pelo menos 6 caracteres."
    );

    if (!contract.isValid()) {
      res.status(400).send(contract.errors()).end();
      return;
    }

    await repository.create({
      ...req.body,
      password: md5(`${req.body.password}${global.SALT_KEY}`),
    });

    emailService.send(
      req.body.email,
      "Bem vindo ao Node Store",
      global.EMAIL_TMPL.replace("{0}", req.body.name)
    );

    res.status(200).send({
      message: "Cliente cadastrado com sucesso!",
    });
  } catch (e) {
    res.status(500).send({
      message: "Fala ao cadastrar o Cliente!",
      data: e,
    });
  }
};
