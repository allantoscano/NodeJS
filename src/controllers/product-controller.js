const ValidationContract = require("../validators/fluent-validator");
const repository = require("../repositories/product-repository");

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

exports.getBySlug = async (req, res, next) => {
  try {
    const data = repository.getBySlug(req.params.slug);

    res.status(200).send(data);
  } catch (e) {
    res.status(500).send({
      message: "Falha ao buscar o produto " + req.params.slug,
      data: e,
    });
  }
};

exports.getById = async (req, res, next) => {
  try {
    const data = await repository.getById(req.params.id);

    res.status(200).send(data);
  } catch (e) {
    res.status(500).send({
      message: "Falha ao buscar o produto " + req.params.id,
      data: e,
    });
  }
};

exports.getByTag = async (req, res, next) => {
  try {
    data = await repository.getByTag(req.params.tag);

    res.status(200).send(data);
  } catch (e) {
    res.status(500).send({
      message: "Falha ao buscar o produto " + req.params.id,
      data: e,
    });
  }
};

exports.post = async (req, res, next) => {
  try {
    let contract = new ValidationContract();

    contract.hasMinLen(
      req.body.title,
      3,
      "O título deve conter pelo menos 3 caracteres."
    );

    contract.hasMinLen(
      req.body.slug,
      3,
      "O slug deve conter pelo menos 3 caracteres."
    );

    contract.hasMinLen(
      req.body.description,
      3,
      "A descrição deve conter pelo menos 3 caracteres."
    );

    //Se os dados forem inválidos
    if (!contract.isValid()) {
      res.status(400).send(contract.errors()).end();
      return;
    }

    await repository.create(req.body);

    res.status(201).send({
      message: "Produto cadastrado com sucesso!",
    });
  } catch (e) {
    res.status(500).send({
      message: "Fala ao cadastrar o produto!",
      data: e,
    });
  }
};

exports.put = async (req, res, next) => {
  try {
    await repository.update(req.params.id, req.body);

    res.status(200).send({
      message: "Produto atualizado com sucesso!",
    });
  } catch (e) {
    res.status(500).send({
      message: "Falha ao atualizar o produto!",
      data: e,
    });
  }
};

exports.delete = async (req, res, next) => {
  try {
    await repository.delete(req.body.id);

    res.status(200).send({
      message: "Produto removido com sucesso!",
    });
  } catch (e) {
    res.status(400).send({
      message: "Falha ao remover um produto!",
      data: e,
    });
  }
};
