import React, { useState } from 'react';
import { NAME_MINIMAL_LENGTH, PASSWORD_MINIMAL_LENGTH } from '../../assets/constants';
import { readStorage } from '../../utils/localStorage';

import httpRequestAxios from '../../utils/httpRequestAxios';
import httpCodeHandler from '../../assets/httpCodeHandler';

import '../Style/AdminRegisterUser.css';

function AdminRegisterUser() {
  const [invalidUser, setInvalidUser] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  function nameHandler(inputName) {
    return inputName.length >= NAME_MINIMAL_LENGTH;
  }

  function emailHandler(inputemail) {
    const emailRegex = /^[\w+.]+@\w+\.\w{2,}(?:\.\w{2})?$/;
    return emailRegex.test(inputemail);
  }

  function passwordHandler(inputPassowrd) {
    return inputPassowrd.length >= PASSWORD_MINIMAL_LENGTH;
  }

  const verifyName = nameHandler(name);
  const verifyEmail = emailHandler(email);
  const verifyPassword = passwordHandler(password);

  const registerAdmDBUser = async (event, userData) => {
    event.preventDefault();
    const { token } = readStorage();

    const { status } = await httpRequestAxios('post', 'http://localhost:3001/admin/register', userData, { headers: { Authorization: token } });

    setName('');
    setEmail('');
    setPassword('');

    if (httpCodeHandler.conflict(status) || httpCodeHandler.unauthorized(status)) {
      setInvalidUser(true);
    }
  };

  return (
    <div className="admin-main-container">
      <div className="admin-header">
        <p>Cadastrar novo usuário</p>
        <span
          data-testid="admin_manage__element-invalid-register"
        >
          { invalidUser && <p>Dados inválidos</p> }
        </span>
      </div>
      <form
        className="admin-form"
        onSubmit={ (event) => registerAdmDBUser(event, {
          name,
          email,
          password,
          role: role.value,
        }) }
      >
        <label htmlFor="name">
          {' '}
          Nome
          <input
            type="text"
            data-testid="admin_manage__input-name"
            name="name"
            id="name"
            value={ name }
            onChange={ ({ target }) => setName(target.value) }
          />
        </label>
        <label htmlFor="email">
          {' '}
          Email
          <input
            type="text"
            data-testid="admin_manage__input-email"
            name="email"
            id="email"
            value={ email }
            onChange={ ({ target }) => setEmail(target.value) }
          />
        </label>
        <label htmlFor="password">
          {' '}
          Senha
          <input
            type="password"
            data-testid="admin_manage__input-password"
            name="password"
            id="password"
            value={ password }
            onChange={ ({ target }) => setPassword(target.value) }
          />
        </label>
        <label htmlFor="role">
          {' '}
          Tipo
          <select
            type="select"
            data-testid="admin_manage__select-role"
            name="role"
            id="role"
          >
            <option value="" selected disabled hidden> </option>
            <option value="seller">Vendedor</option>
            <option value="customer">Cliente</option>
            <option value="administrator">Administrador</option>
          </select>
        </label>
        <button
          type="submit"
          data-testid="admin_manage__button-register"
          disabled={ !(verifyEmail && verifyName && verifyPassword) }
        >
          CADASTRAR
        </button>
      </form>
    </div>
  );
}

export default AdminRegisterUser;
