import { type IUsuario } from "../models/usuario.model";

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000/usuarios';
const LOCAL_STORAGE_KEY = 'mega_cursos_usuarios_db';

const SEED_USERS: IUsuario[] = [
    { ID_Usuario: '1', NomeCompleto: 'Julio Di Franco', Email: 'julio@megacursos.com.br', SenhaHash: 'password123', DataCadastro: '01/01/2026', ID_Plano: 'p2' },
    { ID_Usuario: '2', NomeCompleto: 'Maria Clara', Email: 'maria.clara@gmail.com', SenhaHash: 'securepassword', DataCadastro: '10/02/2026', ID_Plano: 'p1' },
    { ID_Usuario: '3', NomeCompleto: 'Daniel Prof', Email: 'daniel@prof.com.br', SenhaHash: 'professorpass', DataCadastro: '15/01/2026', ID_Plano: '' }
];

export class UsuariosService {

    private static getLocalStorageData(): IUsuario[] {
        const data = localStorage.getItem(LOCAL_STORAGE_KEY);
        if (!data) {
            localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(SEED_USERS));
            return SEED_USERS;
        }
        try {
            return JSON.parse(data).map((u: any) => ({ ...u, ID_Usuario: String(u.ID_Usuario || u.id) }));
        } catch {
            return SEED_USERS;
        }
    }

    private static setLocalStorageData(users: IUsuario[]): void {
        localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(users));
    }

    private async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
        const url = `${API_BASE_URL}${endpoint}`;
        const defaultHeaders = { 'Content-Type': 'application/json' };
        const config: RequestInit = {
            ...options,
            headers: { ...defaultHeaders, ...options.headers },
        };
        const response = await fetch(url, config);
        if (!response.ok) {
            throw new Error(`Erro API (${response.status})`);
        }
        if (response.status === 204) return {} as T;
        return await response.json();
    }

    async listar(): Promise<IUsuario[]> {
        try {
            const data = await this.request<IUsuario[]>('');
            return data.map(u => ({ ...u, ID_Usuario: String(u.ID_Usuario || (u as any).id) }));
        } catch {
            return UsuariosService.getLocalStorageData();
        }
    }

    async buscarPorId(id: string): Promise<IUsuario> {
        try {
            const data = await this.request<IUsuario>(`/${id}`);
            return { ...data, ID_Usuario: String(data.ID_Usuario || (data as any).id) };
        } catch {
            const users = UsuariosService.getLocalStorageData();
            const user = users.find(u => String(u.ID_Usuario) === String(id));
            if (!user) throw new Error('Usuário não encontrado');
            return user;
        }
    }

    async criar(usuario: Omit<IUsuario, 'ID_Usuario'>): Promise<IUsuario> {
        try {
            const data = await this.request<IUsuario>('', {
                method: 'POST',
                body: JSON.stringify(usuario)
            });
            return { ...data, ID_Usuario: String(data.ID_Usuario || (data as any).id) };
        } catch {
            const users = UsuariosService.getLocalStorageData();
            const newId = (users.reduce((max, u) => Math.max(max, parseInt(u.ID_Usuario || '0')), 0) + 1).toString();
            const newUser: IUsuario = {
                ...usuario,
                ID_Usuario: newId
            };
            users.push(newUser);
            UsuariosService.setLocalStorageData(users);
            return newUser;
        }
    }

    async atualizar(id: string, usuario: Partial<IUsuario>): Promise<IUsuario> {
        try {
            const data = await this.request<IUsuario>(`/${id}`, {
                method: 'PUT',
                body: JSON.stringify({ ...usuario, id })
            });
            return { ...data, ID_Usuario: String(data.ID_Usuario || (data as any).id) };
        } catch {
            const users = UsuariosService.getLocalStorageData();
            const index = users.findIndex(u => String(u.ID_Usuario) === String(id));
            if (index === -1) throw new Error('Usuário não encontrado');
            const updatedUser = { ...users[index], ...usuario };
            users[index] = updatedUser;
            UsuariosService.setLocalStorageData(users);
            return updatedUser;
        }
    }

    async deletar(id: string): Promise<void> {
        try {
            await this.request<void>(`/${id}`, { method: 'DELETE' });
        } catch {
            const users = UsuariosService.getLocalStorageData();
            const filteredUsers = users.filter(u => String(u.ID_Usuario) !== String(id));
            UsuariosService.setLocalStorageData(filteredUsers);
        }
    }
}
