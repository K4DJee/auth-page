import { ConflictException, ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { DatabaseService } from '../database/database.service';
import { CratePageWithUserId } from './dto/create-page-with-user-id.dto';
import { DeletingPageDto } from './dto/deleting-page.dto';
import { ChangePageSettingsDto } from './dto/change-page-settings.dto';
import { ChangePageNameDto } from './dto/change-page-name.dto';
import { CreateCommentDto } from './dto/comments/create-comment.dto';
import { DeleteCommentDto } from './dto/comments/delete-comment.dto';
import { ChangeCommentDto } from './dto/comments/change-comment.dto';
import { Role } from '../common/enums/role.enum';


@Injectable()
export class PageService {
  constructor(
    private readonly dbService: DatabaseService
  ){}
  
  async createPage(dto: CratePageWithUserId){
    const page = await this.dbService.page.create({
        data:{
            name: dto.name,
            isPublic: dto.isPublic,
            userId: dto.userId
        },
        select:{
            id: true,
            name: true,
            isPublic: true,
            userId: true,
            comments:true,  
            createdAt: true,
            updatedAt: true
        }
    })

    return page;
  }

  async getPage(id:number){
    const page = await this.dbService.page.findUnique({
        where:{id:id},
        select:{
            id: true,
            name: true,
            comments: true,
            isPublic: true,
            userId: true,
            createdAt: true,
            updatedAt: true,
        }
    });

    if(!page){
        throw new NotFoundException(`Страница с ID: ${id} не найдена`);
    }

    return page;
  }

  async deletePage(dto: DeletingPageDto):Promise<boolean>{
    const existingPage = await this.dbService.page.findUnique({
        where: {id: dto.id},
        select:{
            id: true,
            name: true,
            userId: true
        }
    })

    if(!existingPage){
        throw new NotFoundException(`Страница с таким ID:${dto.id} не найдена`);
    }

    if(dto.userId != existingPage.userId){
        throw new ForbiddenException("У вас недостаточно прав, чтобы произвести действия с этой страницой");
    }

    const deletePage = await this.dbService.page.delete({
        where:{id:dto.id}
    })

    return true;
  }

  async changePageSettings(dto:ChangePageSettingsDto):Promise<boolean>{
    const existingPage = await this.dbService.page.findUnique({
        where: {id: dto.id},
        select:{
            id: true,
            name: true,
            userId: true
        }
    })

    if(!existingPage){
        throw new NotFoundException(`Страница с таким ID:${dto.id} не найдена`);
    }

    if(dto.userId != existingPage.userId && dto.role === Role.USER){
        throw new ForbiddenException("У вас недостаточно прав, чтобы произвести действия с этой страницой");
    }

    const updatedPage = await this.dbService.page.update({
        where:{id: dto.id},
        data:{
             isPublic: dto.isPublic
        },
    })

    return true;
  }

  async changePageName(dto:ChangePageNameDto):Promise<boolean>{
    const existingPage = await this.dbService.page.findUnique({
        where: {id: dto.id},
        select:{
            id: true,
            name: true,
            userId: true
        }
    })

    if(!existingPage){
        throw new NotFoundException(`Страница с таким ID:${dto.id} не найдена`);
    }

    if(dto.userId != existingPage.userId){
        throw new ForbiddenException("У вас недостаточно прав, чтобы произвести действия с этой страницой");
    }

    const updatedPage = await this.dbService.page.update({
        where:{id: dto.id},
        data:{
             name: dto.name
        },
    })

    return true;
  }

  async createComment(dto:CreateCommentDto){
    const comment = await this.dbService.comment.create({
        data:{
            text: dto.text,
            pageId: dto.pageId,
            userId: dto.userId
        },
        select:{
            id:true,
            pageId: true,
            userId: true,
            text: true,
            createdAt: true,
            updatedAt: true,
            isEdited: true,
            user: {
                select:{
                    id: true,
                    firstName: true,
                    lastName: true,
                    email: true,
                }
            },
            page: true,
        }
    });

    if(!comment){
        throw new ConflictException("Ошибка создания комментария");
    }

    return {
        message: "Комментарий создан",
        comment,
    };
  }

  async deleteComment(dto:DeleteCommentDto):Promise<boolean>{
    const existingComment = await this.dbService.comment.findUnique({
        where: {id: dto.id, pageId: dto.pageId},
        select:{
            id: true,
            userId: true
        }
    })

    if(!existingComment){
        throw new NotFoundException(`Комментарий с таким ID:${dto.id} не найден`);
    }

    if(dto.userId != existingComment.userId){
        throw new ForbiddenException("У вас недостаточно прав, чтобы произвести действия с этим комментарием");
    }

    const updatedComment = await this.dbService.comment.delete({
        where:{id: dto.id, pageId: dto.pageId},
    })

    return true;
  }

  async changeComment(dto:ChangeCommentDto):Promise<boolean>{
    const existingComment = await this.dbService.comment.findUnique({
        where: {id: dto.id, pageId: dto.pageId},
        select:{
            id: true,
            userId: true
        }
    })

    if(!existingComment){
        throw new NotFoundException(`Комментарий с таким ID:${dto.id} не найден`);
    }

    if(dto.userId != existingComment.userId){
        throw new ForbiddenException("У вас недостаточно прав, чтобы произвести действия с этим комментарием");
    }

    const updatedComment = await this.dbService.comment.update({
        where:{id: dto.id, pageId: dto.pageId},
        data:{
            text: dto.text
        }
    })

    return true;
  }
}
