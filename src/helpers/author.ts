export interface Author {
  name: string;
  email: string;
}

const isAuthor = /^([^<(]+?)?[ \t]*(?:<([^>(]+?)>)?[ \t]*(?:\(([^)]+?)\)|$)/;

export function formatAuthor(author: string | Partial<Author>, fallback?: string): Author {
  if (typeof author === 'string') {
    const authorMatch = author.match(isAuthor);

    if ((authorMatch && authorMatch[1]) || authorMatch[2]) {
      return {
        name: authorMatch[1],
        email: authorMatch[2],
      };
    }
  } else if (author && typeof author === 'object') {
    return {
      name: author.name,
      email: author.email,
    };
  }

  return {
    name: fallback || '',
    email: '',
  };
}
