import { ProjectArticle } from '@/components/organisms/project-article';
import { getSeedProjectPosts } from '@/lib/project-posts';
import { render, screen } from '@/test/test-utils';

describe('ProjectArticle', () => {
  it.each(['feature-left', 'editorial-split', 'gallery-led'] as const)(
    'should render the project article contract for %s layout',
    (layoutVariant) => {
      const posts = getSeedProjectPosts();
      const post = {
        ...posts.find((item) => item.layoutVariant === layoutVariant)!,
        layoutVariant
      };

      render(<ProjectArticle nextPost={posts[1]} post={post} previousPost={posts[2]} />);

      expect(
        screen.getByRole('heading', {
          level: 1,
          name: post.title
        })
      ).toBeInTheDocument();
      expect(screen.getByText(`${post.readingTimeMinutes} min read`)).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /like this project/i })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /share/i })).toBeInTheDocument();
      expect(screen.getByText(/more from this project/i)).toBeInTheDocument();
      expect(screen.getByRole('link', { name: /request a quote/i })).toHaveAttribute('href', '/contact');
    }
  );

  it('should use the project_post_images hero image for the article header background', () => {
    const posts = getSeedProjectPosts();
    const post = {
      ...posts[0],
      heroImage: '/assets/projects/card-optimised-image.jpeg',
      images: posts[0].images.map((image, index) => ({
        ...image,
        image:
          index === 2
            ? '/assets/projects/header-hero-from-images.jpeg'
            : image.image,
        isHero: index === 2
      }))
    };

    render(<ProjectArticle nextPost={null} post={post} previousPost={null} />);

    expect(screen.getByTestId('project-article-hero-image')).toHaveAttribute(
      'src',
      '/assets/projects/header-hero-from-images.jpeg'
    );
  });
});
