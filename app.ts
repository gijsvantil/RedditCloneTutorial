import { bootstrap } from "@angular/platform-browser-dynamic"; 
import { Component } from "@angular/core";

// Single article model
class Article { 
	title: string;
	link: string;
	votes: number;

	constructor(title: string, link: string, votes?: number) {
		this.title = title;
		this.link = link;
		this.votes = votes || 0;
	}

	domain(): string { 
		try {
			const link: string = this.link.split('//')[1];
			return link.split('/')[0]; 
		} catch (err) {
			return null; }
		}


	voteUp(): void {
		this.votes += 1;
	}

	voteDown(): void {
		this.votes -= 1;
	}
}

@Component({
	// Tags to be used in DOM
	selector: 'reddit-article',
	// Configure this component with inputs that are passed to it from its parent
	inputs: ['article'],
	// Element the component is attached to
	host: {
		class: 'row'
	},
	template: `
		<div class="four wide column center aligned votes">
			<div class="ui statistic">
				<div class="value">
					{{ article.votes }}
				</div>
				<div class="label">
					Points
				</div>
			</div>
		</div>
		<div class="twelve wide column">
			<a class="ui large header" href="{{ article.link }}">
				{{ article.title }}
			</a>
			<div class="meta">({{ article.domain() }})</div>
			<ul class="ui big horizontal list voters">
				<li class="item">
					<a href (click)="voteUp()">
						<i class="arrow up icon"></i>
	  						upvote
						</a> 
					</li>
				<li class="item">
				<a href (click)="voteDown()">
					<i class="arrow down icon"></i>
						downvote
					</a>
				</li> 
			</ul>
		</div> 
`
})


// Component logic / definition class
class ArticleComponent {
	// reference to Article class
	article: Article;

	voteUp(): boolean { 
		this.article.voteUp(); 
		// disable refresh behaviour
		return false;
	}

	voteDown(): boolean { 
		this.article.voteDown(); 
		return false;
	}
}

// Top level application component // RedditApp component
@Component({
	// tags to be used in DOM
	selector: 'reddit',
	// Tell this component about our the article component
	directives: [ArticleComponent],
	template: `
		<form class="ui large form segment">
			<h3 class="ui header">Add a Link</h3>
				<div class="field">
					<label for="title">Title:</label>
					<input name="title" #newtitle>
				</div>

				<div class="field">
					<label for="link">Link:</label>
					<input name="link" #newlink>
				</div>

				<button (click)="addArticle(newtitle, newlink)"
						class="ui positive right floated button">
					Submit link
				</button>
		</form> 
		<div class="ui grid posts">
			<reddit-article 
				*ngFor="let foobar of sortedArticles()"
				[article]="foobar">
			</reddit-article>
		</div>
	`
})

class RedditApp {
	// articles is an array of Articles
	articles: Article[];

	constructor() {
		this.articles = [
		new Article('Angular 2', 'http://angular.io', 3),
		new Article('Fullstack', 'http://fullstack.io', 2)
		]; 
	}
	// Function that grabs input from DOM and pushes that into a new object
	addArticle(title: HTMLInputElement, link: HTMLInputElement): void {
		console.log(`Adding article title: ${title.value} and link: ${link.value}`);
		this.articles.push(new Article(title.value, link.value, 0));
		title.value = '';
		link.value = '';
	}
	// Sort articles by votescore
	sortedArticles(): Article[] {
		return this.articles.sort((a: Article, b: Article) => b.votes - a.votes);
	}

}

bootstrap(RedditApp);
