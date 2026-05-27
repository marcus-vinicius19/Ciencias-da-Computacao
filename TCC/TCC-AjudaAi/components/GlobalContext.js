import { Children, createContext, useState } from "react";
import PocketBase from "pocketbase";
import * as Notifications from "expo-notifications";
export const GlobalContext = createContext();
import { useEffect } from "react";
import AsyncStorage from '@react-native-async-storage/async-storage';


const database = new PocketBase(
  "https://pocketbasetcc-production.up.railway.app"
);

Notifications.setNotificationHandler({
  handleNotification: async () => {
    return {
      shouldPlaySound: true,
      shouldSetBadge: true,
      shouldShowBanner: true,
      shouldShowList: true,
    };
  },
});

export const GlobalProvider = ({ children }) => {
  // App Settings
  const [aiVoice, setAIVoice] = useState(true);

  // Login Database state and functions
  const [currentUser, setCurrentUser] = useState();

  // load persisted user on mount
  useEffect(() => {
    const loadUser = async () => {
      try {
        const raw = await AsyncStorage.getItem('@currentUser');
        if (raw) {
          const parsed = JSON.parse(raw);
          setCurrentUser(parsed);
          // restore pocketbase authStore if token present
          if (parsed && parsed.token) {
            database.authStore.save(parsed.token, parsed.record);
          }
        }
      } catch (e) {
        console.log('loadUser error', e);
      }
    };
    loadUser();
  }, []);

  // persist currentUser whenever it changes
  useEffect(() => {
    const saveUser = async () => {
      try {
        if (currentUser) {
          await AsyncStorage.setItem('@currentUser', JSON.stringify(currentUser));
        } else {
          await AsyncStorage.removeItem('@currentUser');
        }
      } catch (e) {
        console.log('saveUser error', e);
      }
    };
    saveUser();
  }, [currentUser]);

  // load persisted aiVoice on mount
  useEffect(() => {
    const loadAIVoice = async () => {
      try {
        const raw = await AsyncStorage.getItem('@aiVoice');
        if (raw !== null) {
          try {
            const parsed = JSON.parse(raw);
            if (typeof parsed === 'boolean') {
              setAIVoice(parsed);
            } else if (raw === 'true' || raw === 'false') {
              setAIVoice(raw === 'true');
            }
          } catch (_e) {
            // fallback for non-JSON boolean strings
            if (raw === 'true' || raw === 'false') setAIVoice(raw === 'true');
          }
        }
      } catch (e) {
        console.log('loadAIVoice error', e);
      }
    };
    loadAIVoice();
  }, []);

  // persist aiVoice whenever it changes
  useEffect(() => {
    const saveAIVoice = async () => {
      try {
        await AsyncStorage.setItem('@aiVoice', JSON.stringify(aiVoice));
      } catch (e) {
        console.log('saveAIVoice error', e);
      }
    };
    saveAIVoice();
  }, [aiVoice]);

  const logout = async () => {
    try {
      setCurrentUser(undefined);
      //database.authStore.clear();
      await AsyncStorage.removeItem('@currentUser');
    } catch (e) {
      console.log('logout error', e);
    }
  }

  const scheduleNotification = (date) => {
    Notifications.scheduleNotificationAsync({
      content: {
        title: "Alerta de Tarefa",
        body: "Voce tem tarefas pendentes para hoje",
      },
      trigger: {
        date: date,
      },
    });
  };

  async function criarLogin(
    email,
    senha,
    passwordConfirm,
    nome,
    nType,
    birthDate,
    genero
  ) {
    try {
      const maxId = await database.collection("usuario").getList(1, 1, {
        sort: "-created",
      });

      let newId;
      if (typeof maxId.items[0] == "undefined") {
        newId = 1;
      } else {
        newId = parseInt(maxId.items[0].id) + 1;
      }
      console.log(newId);

      const newUser = await database.collection("usuario").create({
        id: newId,
        email: email,
        password: senha,
        passwordConfirm: passwordConfirm,
        nome: nome,
        tipoNeurodivergencia: nType,
        dataNascimento: birthDate,
        genero: genero,
        tutorialFeito: false,
      });

      console.log("conta criada", newUser);

      return true;
    } catch (error) {
      console.log(error);

      return false;
    }
  }

  async function login(email, password) {
    try {
      const authData = await database
        .collection("usuario")
        .authWithPassword(email, password);
      console.log("Login ok");
      console.log("isValid:", database.authStore.isValid);
      console.log("auth model:", database.authStore.record);
      console.log("auth token:", database.authStore.token);

      setCurrentUser(authData);
      return authData;
    } catch (error) {
      try {
        const authAdmin = await database
          .collection("_superusers")
          .authWithPassword(email, password);
        console.log("Login ADM ok");

        setCurrentUser(authAdmin);
        return;
      } catch (error) {
        console.error("Erro no login:", error);
        return;
      }
    }
  }

  async function setTarefa(
    descricao,
    dataInicio,
    dataConclusao,
    subTarefas,
    prioridade,
    tags
  ) {
    if (!currentUser || !currentUser.record || !currentUser.record.id) {
      console.log('setTarefa called without currentUser');
      return false;
    }
    const maxId = await database.collection("tarefa").getList(1, 1, {
      sort: "-dataDeCriacao",
    });
    let newId;
    if (maxId.items.length == 0) {
      newId = 1;
    } else {
      newId = parseInt(maxId.items[0].id) + 1;
    }
    const data = {
      id: newId,
      idUsuario: currentUser.record.id,
      prioridade: prioridade,
      idTag: tags,
      descricao: descricao,
      dataInicio: dataInicio,
      dataConclusao: dataConclusao,
      concluida: false,
    };

    console.log("Tarefa criada: ", data);

    try {
      const record = await database.collection("tarefa").create(data);

      for (const element of subTarefas) {
        await setSubtarefa(element.nomeSubtarefa, data.id);
      }

      return record;
    } catch (error) {
      console.log("setTarefa", error);
      return false;
    }
  }

  async function getTarefa(
    dataConclusao,
    id,
    idUsuario
  ) {
    idUsuario = typeof idUsuario !== 'undefined' ? idUsuario : (currentUser && currentUser.record ? currentUser.record.id : undefined);
    console.log("isValid:", database.authStore.isValid);
    console.log("auth model:", database.authStore.record);
    console.log("auth token:", database.authStore.token);
    console.log(dataConclusao);

    if (typeof id !== "undefined") {
      try {
        const record = await database.collection("tarefa").getList(1, 1, {
          filter: `id = "${id}"`,
  });
  const item = record && record.items && record.items[0];
        if (!item) return [];

        // include subtarefas as steps when fetching a single task
        try {
          const steps = await getSubtarefa(id);
          return { ...item, steps };
        } catch (e) {
          console.log("getTarefa/tarefaId steps fetch", e);
          return { ...item, steps: [] };
        }
      } catch (error) {
        console.log("getTarefa/tarefaId", error);
        return [];
      }
    } else if (typeof dataConclusao !== "undefined") {
      console.log(dataConclusao);
      const start = new Date(`${dataConclusao.dateString} 00:00:00.000`)
        .toISOString()
        .replace("T", " ");

      console.log(start);
      const end = new Date(`${dataConclusao.dateString} 23:59:59.999`)
        .toISOString()
        .replace("T", " ");
      console.log(end);
      try {
        const recordsByDate = await database.collection("tarefa").getFullList({
          filter: `idUsuario = "${idUsuario}" && dataConclusao >= "${start}" && dataConclusao <= "${end}"`,
        });
        const recordsWithSteps = [];

        for (const element of recordsByDate) {
          const steps = await getSubtarefa(element.id);
          console.log(steps);
          const newRecord = { ...element, steps: steps };
          console.log(newRecord.steps);
          recordsWithSteps.push(newRecord);
        }

        console.log(recordsWithSteps);
        return recordsWithSteps;
      } catch (error) {
        console.log("getTarefa/tarefaIdUser", error);
        return [];
      }
    } else if (typeof idUsuario !== "undefined") {
      try {
        console.log(idUsuario);
        const records = await database.collection("tarefa").getFullList({
          filter: `idUsuario = "${idUsuario}"`,
        });

        const recordsWithSteps = [];

        for (const element of records) {
          const steps = await getSubtarefa(element.id);
          console.log(steps);
          const newRecord = { ...element, steps: steps };
          console.log(newRecord.steps);
          recordsWithSteps.push(newRecord);
        }

        console.log(recordsWithSteps);
        return recordsWithSteps;
      } catch (error) {
        console.log("getTarefa/tarefaIdUser", error);
        return [];
      }
    } else {
      try {
        const records = await database.collection("tarefa").getFullList();
        return records;
      } catch (error) {
        console.log("getTarefa", error);
        return [];
      }
    }
  }

  // async function updateTarefa(id, concluida) {
  //   const data = {
  //     concluida: concluida,
  //   };
  //   try {
  //     await database.collection("tarefa").update(id, data);
  //   } catch (error) {
  //     console.log("updateTarefa", error);
  //   }
  // }

  async function updateTarefa(id, concluida){
      const data = {
          concluida: concluida,
      };
      try {
          await database.collection('tarefa').update(id, data);
      }catch (error){
          console.log("updateTarefa/Tarefa", error);
          return;
      }
      if (concluida){
          try{
              const subtarefas = await getSubtarefa(id);
              for (const element of subtarefas) {
                  try{
                      const steps = await updateSubtarefa(element.id, concluida);
                  }catch(error){
                      console.log("updateTarefa/updateSubtarefa")
                  }
              }
          }catch(error){
              console.log("updateTarefa/Subtarefa", error);
         }
      }
  }

  async function updateTarefaCompleta(
    id, 
    descricao,
    dataInicio,
    dataConclusao,
    prioridade,
    tags,
    steps // optional: array of steps to fully replace existing subtarefas
  ) {
    const data = {
      descricao: descricao,
      dataInicio: dataInicio,
      dataConclusao: dataConclusao,
      prioridade: prioridade,
      idTag: tags,
    };
    try {
      await database.collection("tarefa").update(id, data);
      // If steps are provided, replace subtarefas to match the provided list
      if (Array.isArray(steps)) {
        try {
          const existing = await getSubtarefa(id);
          if (Array.isArray(existing)) {
            for (const el of existing) {
              try { await delSubtarefa(el.id); } catch (e) { console.log('updateTarefaCompleta/delSubtarefa el', e); }
            }
          } else if (existing && existing.id) {
            try { await delSubtarefa(existing.id); } catch (e) { console.log('updateTarefaCompleta/delSubtarefa one', e); }
          }

          for (const st of steps) {
            const title = (st && (st.title || st.nomeSubtarefa || st.nome || st.descricao)) || null;
            if (title) {
              try { await setSubtarefa(title, id); } catch (e) { console.log('updateTarefaCompleta/setSubtarefa', e); }
            }
          }
        } catch (e) {
          console.log('updateTarefaCompleta/steps handling', e);
        }
      }
    } catch (error) {
      console.log("updateTarefa", error);
    }
  }

  async function updateAnotacao(id, nomeAnotacao, descricao) {
    const data = {
      nomeAnotacao: nomeAnotacao,
      descricao: descricao,
    };
    try {
      await database.collection("anotacoes").update(id, data);
    } catch (error) {
      console.log("updateTarefa", error);
    }
  }

  async function delTarefa(idTarefa, idUsuario) {
    idUsuario = typeof idUsuario !== 'undefined' ? idUsuario : (currentUser && currentUser.record ? currentUser.record.id : undefined);
    if (typeof idTarefa == "undefined") {
      return false;
    }
    if (!idUsuario) {
      console.log('delTarefa called without currentUser');
      return false;
    }
    try {
      const record = await database.collection("tarefa").getList(1, 1, {
        filter: `id = "${idTarefa}" && idUsuario = "${idUsuario}"`,
      });
      if (record.items.length == 0) {
        return false;
      }
      try {
        const subtarefas = await database.collection("subtarefa").getFullList({
          filter: `idUsuario = "${idUsuario}" && idTarefa = "${idTarefa}"`,
        });

        if (Array.isArray(subtarefas)) {
          for (let i = 0; i < subtarefas.length; i++) {
            await database.collection("subtarefa").delete(subtarefas[i].id);
          }
        } else {
          await database.collection("subtarefa").delete(subtarefas.id);
        }
      } catch (error) {
        console.log("delTarefa/subtarefa", error);
      }

      await database.collection("tarefa").delete(idTarefa);
      return true;
    } catch (error) {
      console.log("delTarefa", error);
      return false;
    }
  }

  async function updateSubtarefa(id, concluida) {
    const data = {
      concluido: concluida,
    };
    console.log(data, id);
    try {
      await database.collection("subtarefa").update(id, data);
    } catch (error) {
      console.log("updateTarefa", error);
    }
  }

  async function getTags(id, idUsuario) {
    idUsuario = typeof idUsuario !== 'undefined' ? idUsuario : (currentUser && currentUser.record ? currentUser.record.id : undefined);
    if (typeof id !== "undefined") {
      try {
        const record = await database.collection("tags").getList(1, 1, {
          filter: `id = "${id}" && idUsuario = "${idUsuario}"`,
        });
        return record.items[0];
      } catch (error) {
        console.log("getTags/tagsId", error);
        return [];
      }
    } else if (typeof idUsuario !== "undefined") {
      try {
        const records = await database.collection("tags").getFullList({
          filter: `idUsuario = "${idUsuario}"`,
        });
        return records;
      } catch (error) {
        console.log("getTags/tagsIdUser", error);
        return [];
      }
    } else {
      try {
        const records = await database.collection("tags").getFullList();
        return records;
      } catch (error) {
        console.log("getTags", error);
        return [];
      }
    }
  }

  async function setTag(descricao) {
    if (!currentUser || !currentUser.record || !currentUser.record.id) {
      console.log('setTag called without currentUser');
      return false;
    }
    const maxId = await database.collection("tags").getList(1, 1, {
      sort: "-dataDeCriacao",
    });
    let newId;
    if (typeof maxId.items[0] == "undefined") {
      newId = 1;
    } else {
      newId = parseInt(maxId.items[0].id) + 1;
    }
    try {
      const existingTag = await database.collection("tags").getList(1, 1, {
        filter: `idUsuario = "${currentUser.record.id}" && descricao = "${descricao}"`,
      });
      console.log("teste", existingTag.items[0]);
      if (typeof existingTag.items[0] !== "undefined") {
        console.log("tag já existente");
        return false;
      }
    } catch (error) {
      console.log("setTag/tagsDescricao", error);
    }
    const data = {
      id: newId,
      idUsuario: currentUser.record.id,
      descricao: descricao,
    };

    try {
      const record = await database.collection("tags").create(data);
      return record;
    } catch (error) {
      console.log("setTag", error);
      return false;
    }
  }

  async function delTags(idTag, idUsuario = currentUser.record.id) {
      if (typeof idTag == "undefined") {
          return false;
      }
      try {
          const record = await database.collection('tags').getList(1, 1, {
              filter: `id = "${idTag}" && idUsuario = "${idUsuario}"`
          });

          if (record.items.length == 0) {
              return false;
          }

          await database.collection('tags').delete(idTag)
          return true;
      } catch (error) {
          console.log("delTag", error)
          return false;
      }
  }

  async function getAnotacoes(id, idUsuario) {
    idUsuario = typeof idUsuario !== 'undefined' ? idUsuario : (currentUser && currentUser.record ? currentUser.record.id : undefined);
    if (typeof id !== "undefined") {
      try {
        const record = await database.collection("anotacoes").getList(1, 1, {
          filter: `id = "${id}" && idUsuario = "${idUsuario}"`,
        });
        return record.items[0];
      } catch (error) {
        console.log("getAnotacoes/anotacoesId", error);
        return [];
      }
    } else if (typeof idUsuario !== "undefined") {
      try {
        const records = await database.collection("anotacoes").getFullList({
          filter: `idUsuario = "${idUsuario}"`,
        });
        return records;
      } catch (error) {
        console.log("getAnotacoes/anotacoesIdUsuario", error);
        return [];
      }
    } else {
      try {
        const records = await database.collection("anotacoes").getFullList();
        return records;
      } catch (error) {
        console.log("getAnotacoes", error);
        return [];
      }
    }
  }

  async function setAnotacoes(nomeAnotacao, descricao) {
    if (!currentUser || !currentUser.record || !currentUser.record.id) {
      console.log('setAnotacoes called without currentUser');
      return false;
    }
    const maxId = await database.collection("anotacoes").getList(1, 1, {
      sort: "-dataDeCriacao",
    });
    let newId;
    if (typeof maxId.items[0] == "undefined") {
      newId = 1;
    } else {
      newId = parseInt(maxId.items[0].id) + 1;
    }
    try {
      const existingAnotacao = await database
        .collection("anotacoes")
        .getList(1, 1, {
          filter: `idUsuario = "${currentUser.record.id}" && nomeAnotacao = "${nomeAnotacao}"`,
        });
      if (existingAnotacao.items.length > 0) {
        console.log("Anotação já existente");
        return false;
      }
    } catch (error) {
      console.log("setAnotacoes/anotacoesNomeAnotacao", error);
    }
    const data = {
      id: newId,
      idUsuario: currentUser.record.id,
      nomeAnotacao: nomeAnotacao,
      descricao: descricao,
    };
    console.log(data);
    try {
      const record = await database.collection("anotacoes").create(data);
      return record;
    } catch (error) {
      console.log("setAnotacoes", error);
      return false;
    }
  }

  async function delAnotacoes(id, idUsuario) {
    idUsuario = typeof idUsuario !== 'undefined' ? idUsuario : (currentUser && currentUser.record ? currentUser.record.id : undefined);
    if (typeof id == "undefined") {
      return false;
    }
    if (!idUsuario) {
      console.log('delAnotacoes called without currentUser');
      return false;
    }
    try {
      const record = await database.collection("anotacoes").getList(1, 1, {
        filter: `id = "${id}" && idUsuario = "${idUsuario}"`,
      });

      if (record.items.length == 0) {
        return false;
      }
      await database.collection("anotacoes").delete(id);
      return true;
    } catch (error) {
      console.log("delAnotacoes", error);
      return false;
    }
  }

  async function getSubtarefa(idTarefa, id, idUsuario) {
    idUsuario = typeof idUsuario !== 'undefined' ? idUsuario : (currentUser && currentUser.record ? currentUser.record.id : undefined);
    if (typeof id !== "undefined") {
      try {
        const record = await database.collection("subtarefa").getList(1, 1, {
          filter: `id = "${id}" && idUsuario = "${idUsuario}"`,
        });
        return record.items[0];
      } catch (error) {
        console.log("getSubtarefa/subtarefaId", error);
        return [];
      }
    } else if (typeof idTarefa !== "undefined") {
      try {
        const recordsByTarefa = await database
          .collection("subtarefa")
          .getFullList({
            filter: `idTarefa = "${idTarefa}" && idUsuario = "${idUsuario}"`,
          });
        return recordsByTarefa;
      } catch (error) {
        console.log("getSubtarefa/subtarefaIdTarefa", error);
        return [];
      }
    } else if (typeof idUsuario !== "undefined") {
      try {
        const records = await database.collection("subtarefa").getFullList({
          filter: `idUsuario = "${idUsuario}"`,
        });
        return records;
      } catch (error) {
        console.log("getSubtarefa/subtarefaIdUser", error);
        return [];
      }
    } else {
      try {
        const records = await database.collection("subtarefa").getFullList();
        return records;
      } catch (error) {
        console.log("getSubtarefa", error);
        return [];
      }
    }
  }

  async function setSubtarefa(nomeSubtarefa, idTarefa) {
    if (!currentUser || !currentUser.record || !currentUser.record.id) {
      console.log('setSubtarefa called without currentUser');
      return false;
    }
    const maxId = await database.collection("subtarefa").getList(1, 1, {
      sort: "-dataDeCriacao",
    });
    let newId;
    if (maxId.items.length == 0) {
      newId = 1;
    } else {
      newId = parseInt(maxId.items[0].id) + 1;
    }
    console.log(newId);

    const data = {
      id: newId,
      idUsuario: currentUser.record.id,
      idTarefa: idTarefa,
      nomeSubtarefa: nomeSubtarefa,
      concluido: false,
    };

    try {
      const record = await database.collection("subtarefa").create(data);
      return record;
    } catch (error) {
      console.log("setSubtarefa", error);
      return false;
    }
  }

  async function delSubtarefa(id, idUsuario) {
    idUsuario = typeof idUsuario !== 'undefined' ? idUsuario : (currentUser && currentUser.record ? currentUser.record.id : undefined);
    if (typeof id == "undefined") {
      return false;
    }
    if (!idUsuario) {
      console.log('delSubtarefa called without currentUser');
      return false;
    }
    try {
      const record = await database.collection("subtarefa").getList(1, 1, {
        filter: `id = "${id}" && idUsuario = "${idUsuario}"`,
      });

      if (record.items.length == 0) {
        return false;
      }
      await database.collection("subtarefa").delete(id);
      return true;
    } catch (error) {
      console.log("delSubtarefa", error);
      return false;
    }
  }

  async function updtUsuario(tipoNeurodivergencia) {
    if (!currentUser || !currentUser.record || !currentUser.record.id) {
      console.log('updtUsuario called without currentUser');
      return false;
    }
    const data = {
      tipoNeurodivergencia: tipoNeurodivergencia,
    };

    try {
      await database.collection("usuario").update(currentUser.record.id, data);
    } catch (error) {
      console.log("updtUsuario/usuario", error);
      try {
        await database
          .collection("_superusers")
          .update(currentUser.record.id, data);
      } catch (error) {
        console.log("updtUsuario/administrador", error);
      }
    }
  }

  async function updtTutorialFeito(tutorialFeito) {
    if (!currentUser || !currentUser.record || !currentUser.record.id) {
      console.log('updtTutorialFeito called without currentUser');
      return false;
    }
    const data = {
      tutorialFeito: tutorialFeito,
    };

    try {
      await database.collection("usuario").update(currentUser.record.id, data);
    } catch (error) {
      console.log("updtUsuario/usuario", error);
      try {
        await database
          .collection("_superusers")
          .update(currentUser.record.id, data);
      } catch (error) {
        console.log("updtUsuario/administrador", error);
      }
    }
  }

  // Return whether the current user has completed the tutorial.
  // Tries to fetch a fresh value from the backend; falls back to the cached currentUser.
  async function getTutorialFeito() {
    try {
      if (typeof currentUser === "undefined") return false;
      const record = await database.collection('usuario').getOne(currentUser.record.id);
      return record.tutorialFeito;
    } catch (e) {
      console.log('getTutorialFeito error', e);
      return (currentUser && currentUser.record && currentUser.record.tutorialFeito);
    }
  }

  async function getNType() {
    try {
      if (typeof currentUser === "undefined") return false;
      const record = await database.collection('usuario').getOne(currentUser.record.id);
      return record.tipoNeurodivergencia;
    } catch (e) {
      console.log('getNType error', e);
      return (currentUser && currentUser.record && currentUser.record.tipoNeurodivergencia);
    }
  }  

  return (
    <GlobalContext.Provider
      value={{
        currentUser,
        setCurrentUser,
        getTarefa,
        setTarefa,
        updateTarefa,
        updateTarefaCompleta,
        delTarefa,
        criarLogin,
        login,
        logout,
        getTutorialFeito,
        getNType,
        updtUsuario,
        updtTutorialFeito,
        getTags,
        setTag,
        delTags,
        getAnotacoes,
        setAnotacoes,
        delAnotacoes,
        updateAnotacao,
        getSubtarefa,
        setSubtarefa,
        delSubtarefa,
        updateSubtarefa,
        aiVoice,
        setAIVoice,
        scheduleNotification,
      }}
    >
      {children}
    </GlobalContext.Provider>
  );
};
