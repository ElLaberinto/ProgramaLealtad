import bcrypt from "bcryptjs";

const hasheador = {
    hash: async (password) => {
        try{
            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(password, salt);
            return hashedPassword;
        } catch(err) {
            throw { status:500 };
        }
    },
    compare: async (password, hashedPassword) => {
        try{
            return await bcrypt.compare(password, hashedPassword);
        } catch(err) {
            throw { status:500 };
        }
        
    }
};

export default hasheador;