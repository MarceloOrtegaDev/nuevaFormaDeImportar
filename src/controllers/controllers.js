
import {newConnection} from "../db/dataBase.js"
export async function obtenerId(req, res){
    const conexion = await newConnection()
    const id = parseInt(req.params.id)
    const [result] = await conexion.query("SELECT * FROM tasks WHERE id = ?", [id])
    
    if(result.length === 0){
        res.json({msg: "No se encuentra este Id"})
    } else {
        res.json(result[0])
    }
    conexion.end()
}

export async function obtenerTodo(req, res){
    const conexion = await newConnection()
    const [result] = await conexion.query("SELECT * FROM tasks")
    res.json(result)
    

    conexion.end()
}

export async function nuevaTask(req, res){
    const conexion = await newConnection()
    const {title, description, isComplete}= req.body
    const [result] = await conexion.query("INSERT INTO tasks (`title`, `description`, `isComplete`) VALUES (?, ?, ?)", [title, description, isComplete]);
        res.json([result]);
        
    conexion.end()
}

export async function editarTask(req, res){
    const conexion = await newConnection();
    const id = parseInt(req.params.id);
    const {title, description, isComplete} = req.body
    const regex = /^(\S+)( \S+)*$/
    
    if(title.length === 0 || description.length === 0){
        res.json({msg: "Los campos no deben estar vacios."})
    } else if (regex.test(title)){
        const isCompleteValue = isComplete === true || isComplete === 'true' ? 1 : 0;
        const [result] = await conexion.query("UPDATE `tasks` SET `title`= ?,`description`= ?,`isComplete`= ? WHERE `id` = ?", [title, description, isCompleteValue, id]);
                if (result.affectedRows === 0) {
                    res.json({msg: "No se encontró la task con el id especificado."});
                } else {
                    res.json(result);
                }
        } else {
            res.json({msg: "Los títulos y descripciones no deben contener caracteres especiales o espacios innecesarios."})
        }


    conexion.end();
}

export async function eliminarTask(req, res){
    const conexion = await newConnection();
    const id = parseInt(req.params.id);
    const [result] = await conexion.query("DELETE FROM tasks WHERE id =?", [id]);
    
    if (result.affectedRows === 0) {
        res.json({msg: "No se encontró la task con el id especificado."});
    } else {
        res.json({msg: "Se eliminó la task correctamente."});
    }
    conexion.end();
}