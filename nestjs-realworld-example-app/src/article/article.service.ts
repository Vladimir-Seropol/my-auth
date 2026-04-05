import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DeleteResult } from 'typeorm';
import { ArticleEntity } from './article.entity';
import { Comment } from './comment.entity';
import { UserEntity } from '../user/user.entity';
import { FollowsEntity } from '../profile/follows.entity';
import { CreateArticleDto } from './dto';
import { ArticleRO, ArticlesRO, CommentsRO } from './article.interface';
import slug from 'slug';

@Injectable()
export class ArticleService {
  constructor(
    @InjectRepository(ArticleEntity)
    private readonly articleRepository: Repository<ArticleEntity>,

    @InjectRepository(Comment)
    private readonly commentRepository: Repository<Comment>,

    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,

    @InjectRepository(FollowsEntity)
    private readonly followsRepository: Repository<FollowsEntity>
  ) {}

  // ------------------ Find All ------------------
  async findAll(query: any): Promise<ArticlesRO> {
    const qb = this.articleRepository.createQueryBuilder('article')
      .leftJoinAndSelect('article.author', 'author');

    qb.where('1=1');

    if (query.tag) {
      qb.andWhere('article.tagList LIKE :tag', { tag: `%${query.tag}%` });
    }

    if (query.author) {
      const author = await this.userRepository.findOne({
        where: { username: query.author },
      });
      if (author) {
        qb.andWhere('article.authorId = :id', { id: author.id });
      }
    }

    if (query.favorited) {
      const author = await this.userRepository.findOne({
        where: { username: query.favorited },
        relations: ['favorites'],
      });
      if (author?.favorites?.length) {
        const ids = author.favorites.map(a => a.id);
        qb.andWhere('article.id IN (:...ids)', { ids });
      }
    }

    qb.orderBy('article.created', 'DESC');

    if (query.limit) qb.limit(query.limit);
    if (query.offset) qb.offset(query.offset);

    const [articles, articlesCount] = await qb.getManyAndCount();

    return { articles, articlesCount };
  }

  // ------------------ Find Feed ------------------
  async findFeed(userId: number, query: any): Promise<ArticlesRO> {
    const follows = await this.followsRepository.find({ where: { followerId: userId } });
    if (!follows.length) return { articles: [], articlesCount: 0 };

    const ids = follows.map(f => f.followingId);

    const qb = this.articleRepository.createQueryBuilder('article')
      .where('article.authorId IN (:...ids)', { ids })
      .orderBy('article.created', 'DESC');

    if (query.limit) qb.limit(query.limit);
    if (query.offset) qb.offset(query.offset);

    const [articles, articlesCount] = await qb.getManyAndCount();

    return { articles, articlesCount };
  }

  // ------------------ Find One ------------------
  async findOne(where: any): Promise<ArticleRO> {
    const article = await this.articleRepository.findOne({ where });
    if (!article) throw new NotFoundException('Article not found');
    return { article };
  }

  // ------------------ Comments ------------------
  async addComment(slug: string, commentData: { body: string }): Promise<ArticleRO> {
    const article = await this.articleRepository.findOne({
      where: { slug },
      relations: ['comments'],
    });
    if (!article) throw new NotFoundException(`Article "${slug}" not found`);

    if (!article.comments) article.comments = [];

    const comment = this.commentRepository.create({
      body: commentData.body,
      article,
    });

    await this.commentRepository.save(comment);
    article.comments.push(comment);

    const updatedArticle = await this.articleRepository.save(article);
    return { article: updatedArticle };
  }

  async deleteComment(slug: string, commentId: number): Promise<ArticleRO> {
    const article = await this.articleRepository.findOne({
      where: { slug },
      relations: ['comments'],
    });
    if (!article) throw new NotFoundException(`Article "${slug}" not found`);

    const comment = await this.commentRepository.findOne({ where: { id: commentId } });
    if (!comment) throw new NotFoundException('Comment not found');

    article.comments = article.comments?.filter(c => c.id !== comment.id) || [];
    await this.commentRepository.delete(comment.id);
    const updatedArticle = await this.articleRepository.save(article);
    return { article: updatedArticle };
  }

  async findComments(slug: string): Promise<CommentsRO> {
    const article = await this.articleRepository.findOne({
      where: { slug },
      relations: ['comments'],
    });
    if (!article) throw new NotFoundException(`Article "${slug}" not found`);

    return { comments: article.comments || [] };
  }

  // ------------------ Favorite ------------------
  async favorite(userId: number, slug: string): Promise<ArticleRO> {
    const article = await this.articleRepository.findOne({ where: { slug } });
    const user = await this.userRepository.findOne({ where: { id: userId }, relations: ['favorites'] });

    if (!article || !user) throw new NotFoundException('Article or User not found');

    if (!user.favorites) user.favorites = [];
    if (!user.favorites.find(a => a.id === article.id)) {
      user.favorites.push(article);
      article.favoriteCount = (article.favoriteCount || 0) + 1;
      await this.userRepository.save(user);
      await this.articleRepository.save(article);
    }

    return { article };
  }

  async unFavorite(userId: number, slug: string): Promise<ArticleRO> {
    const article = await this.articleRepository.findOne({ where: { slug } });
    const user = await this.userRepository.findOne({ where: { id: userId }, relations: ['favorites'] });

    if (!article || !user) throw new NotFoundException('Article or User not found');

    user.favorites = user.favorites?.filter(a => a.id !== article.id) || [];
    article.favoriteCount = Math.max((article.favoriteCount || 1) - 1, 0);

    await this.userRepository.save(user);
    await this.articleRepository.save(article);

    return { article };
  }

  // ------------------ Create/Update/Delete ------------------
  async create(userId: number, articleData: CreateArticleDto): Promise<ArticleEntity> {
    const article = this.articleRepository.create({
      ...articleData,
      slug: this.slugify(articleData.title),
      comments: [],
    });

    const author = await this.userRepository.findOne({ where: { id: userId }, relations: ['articles'] });
    if (!author) throw new NotFoundException('Author not found');

    if (!author.articles) author.articles = [];
    author.articles.push(article);

    await this.articleRepository.save(article);
    await this.userRepository.save(author);

    return article;
  }

  async update(slug: string, articleData: Partial<ArticleEntity>): Promise<ArticleRO> {
    const article = await this.articleRepository.findOne({ where: { slug } });
    if (!article) throw new NotFoundException('Article not found');

    Object.assign(article, articleData);
    const updated = await this.articleRepository.save(article);
    return { article: updated };
  }

  async delete(slug: string): Promise<DeleteResult> {
    return await this.articleRepository.delete({ slug });
  }

  // ------------------ Slug ------------------
  slugify(title: string): string {
    return slug(title, { lower: true }) + '-' + (Math.random() * Math.pow(36, 6) | 0).toString(36);
  }
}