import { User } from "./user.model";

export class Vehicle {
    id: number = 0;
    name: string = '';
    registration: string = '';
    brand: string = '';
    model?: string
    carbType: CarbType = CarbType.Biodiesel;
    consum: number = 0;
    fav: boolean = false;
    userId?: number;
    user: User | null = null; 
}

export enum CarbType {
    Biodiesel = 'Biodiésel',
    Bioetanol = 'Bioetanol',
    Gas_Natural_Comprimido = 'Gas Natural Comprimido',
    Gas_Natural_Licuado = 'Gas Natural Licuado',
    Gases_licuados_del_petróleo = 'Gases licuados del petróleo',
    Gasoleo_A = 'Gasóleo A habitual',
    Gasoleo_B = 'Gasóleo B',
    Gasoleo_Premium = 'Gasóleo Premium',
    Gasolina_95_E10 = 'Gasolina 95 E10',
    Gasolina_95_E5 = 'Gasolina 95 E5',
    Gasolina_95_E5_Premium = 'Gasolina 95 E5 Premium',
    Gasolina_98_E10 = 'Gasolina 98 E10',
    Gasolina_98_E5 = 'Gasolina 98 E5',
    Hidrogeno = 'Hidrógeno',
    Electric = 'Electric',
    Calories = 'Calories',
  }