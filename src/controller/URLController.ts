import { Request, response, Response } from "express";
import { nanoid } from 'nanoid'
import { config } from '../config/Constants'
import { URLModel } from "../database/model/URL";


export class URLController {
    public async shorten(req: Request, res: Response): Promise<void> {


        const { originURL } = req.body;
        const url = await URLModel.findOne({ originURL })
        if(url) {
            res.json(url)
            return
        }

        //Criar o hash para essa URL
        
        const hash = nanoid();
        const shortURL = `${config.API_URL}/${hash}`

        //Salvar a URL no banco
        const newURL = await URLModel.create({ hash, shortURL, originURL })
        res.json(newURL)

        //Retornar a URL 
        res.json({ originURL, hash, shortURL })
    }

    public async redirect(req: Request, res: Response): Promise<void> {
        //Pegar o hash da URL
        const { hash } = req.params
        const url = await URLModel.findOne({ hash })

        if(url) {
            res.redirect(url.originURL)
            return
        }

        res.status(400).json({ error: 'URL not found'})
    

    }
}