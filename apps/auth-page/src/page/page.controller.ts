import { Controller, Get, Post, Body, Param, Delete, ParseIntPipe, UseGuards, Req, Put } from '@nestjs/common';
import { PageService } from './page.service';
import { AuthGuard } from '../auth/guards/auth.guard';
import { CreatePageDto } from './dto/create-page.dto';
import type{ Request } from 'express';
import { ChangePageSettingsDto1 } from './dto/change-page-settings1.dto';
import { ChangePageNameDto1 } from './dto/change-page-name1.dto';
import { CreateCommentBodyDto } from './dto/comments/create-comment-body.dto';
import { ApiBearerAuth, ApiOperation } from '@nestjs/swagger';

@Controller('page')
export class PageController {
  constructor(private readonly pageService: PageService) {}

  @ApiOperation({summary: "Получение страницы", description: "Получение данных страницы"})
  @Get('/:id')
  async getPage(@Param('id', ParseIntPipe) id: number){
    return await this.pageService.getPage(id);
  }

  @ApiOperation({summary: "Создание страницы", description: "Создание страницы пользователем"})
  @ApiBearerAuth('access-token')
  @UseGuards(AuthGuard)
  @Post('/new-page')
  async createPage(@Req() req: Request, @Body() dto: CreatePageDto){
    const dtoWithUserId = {
      name: dto.name,
      isPublic: dto.isPublic,
      userId: req.user!['id']
    }
    return this.pageService.createPage(dtoWithUserId);
  }

  @ApiOperation({summary: "Удаление страницы", description: "Удаление страницы пользователем, модератором и админом"})
  @ApiBearerAuth('access-token')
  @UseGuards(AuthGuard)
  @Delete('/:id')
  async deletePage(@Param('id', ParseIntPipe) id: number,  @Req() req: Request){
    const userId = req.user!['id'];
    const deletingPageDto = {
      id: id,
      userId: userId
    }
    const isDeletingPage = await this.pageService.deletePage(deletingPageDto);

    if(!isDeletingPage){
      return {
        message: "Ошибка при удалении страницы"
      }
    }
    
    return {
      message: "Страница успешно удалена!"
    }
  }

  @ApiOperation({summary: "Изменение настроек страницы", description: "Изменение настроек страницы пользователем"})
  @ApiBearerAuth('access-token')
  @UseGuards(AuthGuard)
  @Put('/:id/change-page-settings')
  async changePageSettings(
    @Req() req: Request,
    @Body() dto: ChangePageSettingsDto1,
    @Param('id', ParseIntPipe) id:number
  ){
    const userId = req.user!['id'];
    const updatedPageDto = {
      id: id,
      isPublic: dto.isPublic,
      userId: userId,
      role: req.user!['role']
    };

    const isUpdatingPage = await this.pageService.changePageSettings(updatedPageDto);

    if(!isUpdatingPage){
      return{
        message:"Ошибка при обновлении настроек страницы"
      }
    }

    return {
      message: "Страница была успешно обновлена"
    }
  }

  @ApiOperation({summary: "Изменение названия страницы", description: "Изменение названия страницы пользователем"})
  @ApiBearerAuth('access-token')
  @UseGuards(AuthGuard)
  @Put('/:id/change-page-name')
  async changePageName(
    @Req() req: Request,
    @Body() dto:ChangePageNameDto1,
    @Param('id', ParseIntPipe) id:number
  ){
    const userId = req.user!['id'];
    const updatedPageDto = {
      id: id,
      name: dto.name,
      userId: userId
    };

    const isUpdatingPage = await this.pageService.changePageName(updatedPageDto);

    if(!isUpdatingPage){
      return{
        message:"Ошибка при обновлении настроек страницы"
      }
    }

    return {
      message: "Страница была успешно обновлена"
    }
  }

  @ApiOperation({summary: "Создание комментария", description: "Создание комментария на странице пользователем"})
  @ApiBearerAuth('access-token')
  @UseGuards(AuthGuard)
  @Post('/:id/create-comment')
  async createComment(
    @Param('id', ParseIntPipe) id:number, 
    @Body() dto: CreateCommentBodyDto,
    @Req() req: Request,
){
  const userId = req.user!['id'];
    const createCommentDto = {
      pageId: id,
      userId: userId,
      text: dto.text,
    }

    return await this.pageService.createComment(createCommentDto);
  }

  @ApiOperation({summary: "Удаление комментария", description: "Удаление комментария пользователем"})
  @ApiBearerAuth('access-token')
  @UseGuards(AuthGuard)
  @Delete('/:pageId/comment/:id')
  async deleteComment(
    @Req() req: Request,
    @Param('pageId', ParseIntPipe) pageId:number, 
    @Param('id', ParseIntPipe) id:number, 
  ){
    const userId = req.user!['id'];
    const deleteCommentDto = {
      id:id,
      pageId: pageId,
      userId: userId
    }

    const isDeletingComment = await this.pageService.deleteComment(deleteCommentDto);
    if(!isDeletingComment){
      return {
        message:"Ошибка удаления комментария"
      }
    }

    return {
      message:"Комментарий был успешно удалён"
    }
  }

  @ApiOperation({summary: "Изменение текста комментария", description: "Изменение текста комментария пользователем"})
  @ApiBearerAuth('access-token')
  @UseGuards(AuthGuard)
  @Put('/:pageId/comment/:id')
  async changeComment(
    @Body() dto:CreateCommentBodyDto,
    @Req() req: Request,
    @Param('pageId', ParseIntPipe) pageId:number, 
    @Param('id', ParseIntPipe) id:number, 
  ){
    const userId = req.user!['id'];
    const deleteCommentDto = {
      id:id,
      pageId: pageId,
      userId: userId,
      text:dto.text
    }

    const isUpdatingComment = await this.pageService.changeComment(deleteCommentDto);
    if(!isUpdatingComment){
      return {
        message:"Ошибка изменения комментария"
      }
    }

    return {
      message:"Комментарий был успешно изменён"
    }
  }
}
