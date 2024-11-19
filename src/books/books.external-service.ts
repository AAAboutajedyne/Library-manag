import { Injectable, NotFoundException } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import axios from "axios";
import * as R from "ramda";

@Injectable()
export class BooksExternalService {
  
  constructor(
    private readonly configService: ConfigService,
  ) {}

  async bookByISBN(isbn: string) {
    const externalBookApiUrl = this.configService.get("EXTERNAL_BOOK_API_URL")
    const response = await axios.get(externalBookApiUrl + `?bibkeys=ISBN:${isbn}&format=json`)
    // console.log("response: ", response.status, response.data)
    if(response.status !== 200 || R.isEmpty(response.data)) {
      throw new NotFoundException(`Book(isbn: ${isbn}) not found !`)
    }

    return response.data;  
  }

}
