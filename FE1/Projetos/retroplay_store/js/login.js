document.addEventListener('DOMContentLoaded', function () {

    const formLogin   = document.getElementById('form-login');
    const formEdicao  = document.getElementById('form-edicao');
    const painelLogin = document.getElementById('painel-login');
    const painelLogado = document.getElementById('painel-logado');
    const alertaLogin  = document.getElementById('alerta-login');
    const alertaLogado = document.getElementById('alerta-logado');
    const painelCadastro = document.getElementById('painel-cadastro');

    const btnIrCadastro = document.getElementById('btn-ir-cadastro');
    const btnIrLogin    = document.getElementById('btn-ir-login');

    if (btnIrCadastro) {
        btnIrCadastro.addEventListener('click', function (e) {
            e.preventDefault();
            if (painelLogin)    painelLogin.classList.add('oculto');
            if (painelCadastro) painelCadastro.classList.remove('oculto');
        });
    }

    if (btnIrLogin) {
        btnIrLogin.addEventListener('click', function (e) {
            e.preventDefault();
            if (painelCadastro) painelCadastro.classList.add('oculto');
            if (painelLogin)    painelLogin.classList.remove('oculto');
        });
    }

    
    const campoCpf = document.getElementById('cad-cpf');
    if (campoCpf) {
        campoCpf.addEventListener('input', function () {
            let v = this.value.replace(/\D/g, '');
            if (v.length > 11) v = v.substring(0, 11);
            if (v.length > 9) {
                v = v.replace(/(\d{3})(\d{3})(\d{3})(\d{1,2})/, '$1.$2.$3-$4');
            } else if (v.length > 6) {
                v = v.replace(/(\d{3})(\d{3})(\d{1,3})/, '$1.$2.$3');
            } else if (v.length > 3) {
                v = v.replace(/(\d{3})(\d{1,3})/, '$1.$2');
            }
            this.value = v;
        });
    }

    const campoCep = document.getElementById('cad-cep');
    if (campoCep) {
        campoCep.addEventListener('input', function () {
            let v = this.value.replace(/\D/g, '');
            if (v.length > 8) v = v.substring(0, 8);
            if (v.length > 5) {
                v = v.replace(/(\d{5})(\d{1,3})/, '$1-$2');
            }
            this.value = v;
        });
    }

    const campoCepEditar = document.getElementById('e-cep');
    if (campoCepEditar) {
        campoCepEditar.addEventListener('input', function () {
            let v = this.value.replace(/\D/g, '');
            if (v.length > 8) v = v.substring(0, 8);
            if (v.length > 5) {
                v = v.replace(/(\d{5})(\d{1,3})/, '$1-$2');
            }
            this.value = v;
        });
    }

    const formCadastro = document.getElementById('form-cadastro');
    const alertaCadastro = document.getElementById('alerta-cadastro');

    function mostrarAlertaCadastro(html) {
        if (alertaCadastro) {
            alertaCadastro.innerHTML = html;
            alertaCadastro.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
    }

    if (formCadastro) {
        formCadastro.addEventListener('submit', function (e) {
            e.preventDefault();

            const nome   = document.getElementById('cad-nome').value.trim();
            const email  = document.getElementById('cad-email').value.trim();
            const cpf    = document.getElementById('cad-cpf').value.trim();
            const tel    = document.getElementById('cad-tel').value.trim();
            const cep    = document.getElementById('cad-cep').value.trim();
            const rua    = document.getElementById('cad-rua').value.trim();
            const numero = document.getElementById('cad-numero').value.trim();
            const complemento = document.getElementById('cad-complemento').value.trim();
            const senha  = document.getElementById('cad-senha').value;
            const senha2 = document.getElementById('cad-senha2').value;

            if (!nome || !email || !cpf || !cep || !rua || !numero || !senha) {
                mostrarAlertaCadastro('<div class="alerta alerta-erro">Preencha todos os campos obrigatorios!</div>');
                return;
            }
            const cepLimpo = cep.replace(/\D/g, '');
            if (cepLimpo.length !== 8) {
                mostrarAlertaCadastro('<div class="alerta alerta-erro">CEP invalido! Use um CEP com 8 digitos.</div>');
                return;
            }
            if (email.indexOf('@') === -1 || email.indexOf('.') === -1) {
                mostrarAlertaCadastro('<div class="alerta alerta-erro">E-mail invalido!</div>');
                return;
            }
            if (!validarCPF(cpf)) {
                mostrarAlertaCadastro('<div class="alerta alerta-erro">CPF invalido! Use um CPF valido com 11 digitos.</div>');
                return;
            }
            if (senha.length < 6) {
                mostrarAlertaCadastro('<div class="alerta alerta-erro">A senha deve ter no minimo 6 caracteres!</div>');
                return;
            }
            if (senha !== senha2) {
                mostrarAlertaCadastro('<div class="alerta alerta-erro">As senhas nao conferem!</div>');
                return;
            }

            const resultado = cadastrarCliente({
                nome: nome,
                email: email,
                cpf: cpf.replace(/\D/g, ''),
                telefone: tel,
                rua: rua,
                cep: cepLimpo,
                numero: numero,
                complemento: complemento,
                senha: senha
            });

            if (!resultado.ok) {
                mostrarAlertaCadastro('<div class="alerta alerta-erro">' + resultado.msg + '</div>');
                return;
            }

            mostrarAlertaCadastro('<div class="alerta alerta-sucesso">Cadastro realizado! ID: <strong>' + resultado.id + '</strong>. Fazendo login automaticamente...</div>');
            formCadastro.reset();


            setTimeout(function () {
                const res = login(email, senha);
                if (res.ok) {
                    atualizarNavbar();
                    mostrarPainelLogado(res.cliente);
                } else {
                    if (painelCadastro) painelCadastro.classList.add('oculto');
                    if (painelLogin)    painelLogin.classList.remove('oculto');
                }
            }, 1800);
        });
    }


    const sessao = getSessao();
    if (sessao) {
        mostrarPainelLogado(sessao);
    }

    if (formLogin) {
        formLogin.addEventListener('submit', function (e) {
            e.preventDefault();

            const email = document.getElementById('l-email').value.trim();
            const senha = document.getElementById('l-senha').value;

            if (!email || !senha) {
                alertaLogin.innerHTML = '<div class="alerta alerta-erro">Preencha todos os campos!</div>';
                return;
            }

            const resultado = login(email, senha);

            if (!resultado.ok) {
                alertaLogin.innerHTML = '<div class="alerta alerta-erro">' + resultado.msg + '</div>';
                return;
            }

            alertaLogin.innerHTML = '<div class="alerta alerta-sucesso">Login realizado com sucesso!</div>';
            formLogin.reset();

            
            atualizarNavbar();
            mostrarPainelLogado(resultado.cliente);
        });
    }

   
    if (formEdicao) {
        formEdicao.addEventListener('submit', function (e) {
            e.preventDefault();

            const sessaoAtual = getSessao();
            if (!sessaoAtual) return;

            const nome   = document.getElementById('e-nome').value.trim();
            const email  = document.getElementById('e-email').value.trim();
            const cpf    = document.getElementById('e-cpf').value.trim();
            const tel    = document.getElementById('e-tel').value.trim();
            const cep    = document.getElementById('e-cep').value.trim();
            const rua    = document.getElementById('e-rua').value.trim();
            const numero = document.getElementById('e-numero').value.trim();
            const complemento = document.getElementById('e-complemento').value.trim();
            const senha  = document.getElementById('e-senha').value;

            if (!nome || !email || !cpf || !cep || !rua || !numero) {
                alertaLogado.innerHTML = '<div class="alerta alerta-erro">Nome, e-mail, CPF e endereco (CEP, rua, numero) sao obrigatorios!</div>';
                return;
            }
            const cepLimpoEdit = cep.replace(/\D/g, '');
            if (cepLimpoEdit.length !== 8) {
                alertaLogado.innerHTML = '<div class="alerta alerta-erro">CEP invalido! Use um CEP com 8 digitos.</div>';
                return;
            }

            if (email.indexOf('@') === -1 || email.indexOf('.') === -1) {
                alertaLogado.innerHTML = '<div class="alerta alerta-erro">E-mail invalido!</div>';
                return;
            }

            if (!validarCPF(cpf)) {
                alertaLogado.innerHTML = '<div class="alerta alerta-erro">CPF invalido!</div>';
                return;
            }

            if (email !== sessaoAtual.email) {
                const clientes = getClientes();
                const emailExiste = clientes.find(function(c) { return c.email === email && c.id !== sessaoAtual.id; });
                if (emailExiste) {
                    alertaLogado.innerHTML = '<div class="alerta alerta-erro">Este e-mail ja esta em uso por outro cliente!</div>';
                    return;
                }
            }

            const cpfLimpo = cpf.replace(/\D/g, '');
            if (cpfLimpo !== sessaoAtual.cpf) {
                const clientes2 = getClientes();
                const cpfExiste = clientes2.find(function(c) { return c.cpf === cpfLimpo && c.id !== sessaoAtual.id; });
                if (cpfExiste) {
                    alertaLogado.innerHTML = '<div class="alerta alerta-erro">Este CPF ja esta em uso por outro cliente!</div>';
                    return;
                }
            }

            const dadosNovos = {
                nome: nome,
                email: email,
                cpf: cpfLimpo,
                telefone: tel,
                rua: rua,
                cep: cepLimpoEdit,
                numero: numero,
                complemento: complemento
            };

            if (senha) {
                if (senha.length < 6) {
                    alertaLogado.innerHTML = '<div class="alerta alerta-erro">A senha deve ter no minimo 6 caracteres!</div>';
                    return;
                }
                dadosNovos.senha = senha;
            }

            const ok = editarCliente(sessaoAtual.id, dadosNovos);

            if (!ok) {
                alertaLogado.innerHTML = '<div class="alerta alerta-erro">Erro ao salvar alteracoes!</div>';
                return;
            }


            const clienteAtualizado = Object.assign({}, sessaoAtual, dadosNovos, { id: sessaoAtual.id });
            setSessao(clienteAtualizado);
            atualizarNavbar();

            alertaLogado.innerHTML = '<div class="alerta alerta-sucesso">Dados atualizados com sucesso!</div>';
            document.getElementById('e-senha').value = '';

            
            document.getElementById('titulo-logado').textContent = 'Perfil - ' + nome.split(' ')[0];
        });
    }

    
    function mostrarPainelLogado(cliente) {
        if (painelLogin)  painelLogin.classList.add('oculto');
        if (painelLogado) painelLogado.classList.remove('oculto');

        document.getElementById('logado-id').textContent = cliente.id;
        document.getElementById('titulo-logado').textContent = 'Perfil - ' + cliente.nome.split(' ')[0];

        
        document.getElementById('e-nome').value  = cliente.nome || '';
        document.getElementById('e-email').value = cliente.email || '';

       
        let cpf = cliente.cpf || '';
        if (cpf.length === 11) {
            cpf = cpf.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
        }
        document.getElementById('e-cpf').value = cpf;
        document.getElementById('e-tel').value = cliente.telefone || '';

        let cepVal = cliente.cep || '';
        if (cepVal.length === 8) {
            cepVal = cepVal.replace(/(\d{5})(\d{3})/, '$1-$2');
        }
        document.getElementById('e-cep').value = cepVal;
        document.getElementById('e-rua').value = cliente.rua || '';
        document.getElementById('e-numero').value = cliente.numero || '';
        document.getElementById('e-complemento').value = cliente.complemento || '';

        document.getElementById('e-senha').value = '';
    }

});
