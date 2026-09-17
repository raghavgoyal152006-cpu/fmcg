import type { Product } from '../types';

// Common FMCG synonyms dictionary
const SYNONYMS: Record<string, string[]> = {
  'atta': ['flour', 'wheat', 'gehu', 'chakki', 'aashirvaad', 'fortune'],
  'flour': ['atta', 'wheat', 'sharbati'],
  'rice': ['chawal', 'basmati', 'biryani', 'daawat', 'india gate'],
  'chawal': ['rice', 'basmati'],
  'dal': ['pulses', 'toor', 'arhar', 'moong', 'chana', 'tata sampann'],
  'pulses': ['dal', 'toor', 'moong'],
  'oil': ['sunflower', 'cooking oil', 'tel', 'ghee', 'saffola', 'fortune'],
  'tel': ['oil', 'cooking oil'],
  'ghee': ['cow ghee', 'amul ghee', 'clarified butter'],
  'milk': ['doodh', 'taaza', 'amul', 'nandini', 'dairy'],
  'doodh': ['milk', 'dairy'],
  'butter': ['makhan', 'amul butter', 'table butter'],
  'bread': ['loaf', 'wheat bread', 'brown bread', 'sandwich'],
  'tea': ['chai', 'patti', 'tata tea', 'assam'],
  'chai': ['tea', 'tata tea gold'],
  'coffee': ['nescafe', 'caffeine', 'espresso'],
  'coke': ['coca cola', 'soda', 'cold drink', 'soft drink'],
  'biscuit': ['cookies', 'parle-g', 'good day', 'oreo'],
  'chips': ['lays', 'wafers', 'crisps', 'namkeen'],
  'maggie': ['maggi', 'noodles', 'instant food'],
  'surf': ['surf excel', 'detergent', 'washing powder', 'laundry', 'matic', 'ariel'],
  'soap': ['handwash', 'dettol', 'cleanser'],
  'paste': ['toothpaste', 'colgate', 'maxfresh'],
  'diaper': ['pampers', 'baby care', 'pants'],
};

// Levenshtein distance for typo tolerance
function levenshteinDistance(a: string, b: string): number {
  const an = a ? a.length : 0;
  const bn = b ? b.length : 0;
  if (an === 0) return bn;
  if (bn === 0) return an;
  const matrix = Array.from({ length: bn + 1 }, () => new Array(an + 1).fill(0));
  for (let i = 0; i <= bn; ++i) matrix[i][0] = i;
  for (let i = 0; i <= an; ++i) matrix[0][i] = i;

  for (let i = 1; i <= bn; ++i) {
    for (let j = 1; j <= an; ++j) {
      if (b.charAt(i - 1) === a.charAt(j - 1)) {
        matrix[i][j] = matrix[i - 1][j - 1];
      } else {
        matrix[i][j] = Math.min(
          matrix[i - 1][j - 1] + 1,
          Math.min(matrix[i][j - 1] + 1, matrix[i - 1][j] + 1)
        );
      }
    }
  }
  return matrix[bn][an];
}

// Fuzzy string match helper
function isFuzzyMatch(needle: string, haystack: string, maxDistance: number = 2): boolean {
  if (haystack.includes(needle)) return true;
  const words = haystack.split(/\s+/);
  for (const word of words) {
    if (Math.abs(word.length - needle.length) <= maxDistance) {
      if (levenshteinDistance(needle, word) <= maxDistance) {
        return true;
      }
    }
  }
  return false;
}

export interface SearchResult {
  product: Product;
  relevanceScore: number;
  matchedFields: string[];
}

export function performSmartFmcgSearch(
  products: Product[],
  query: string,
  activeCategory: string = 'all',
  activeBrand: string | null = null
): Product[] {
  let filtered = products;

  // Category filter
  if (activeCategory && activeCategory !== 'all') {
    filtered = filtered.filter((p) => p.category === activeCategory);
  }

  // Brand filter
  if (activeBrand) {
    filtered = filtered.filter((p) => p.brand.toLowerCase() === activeBrand.toLowerCase());
  }

  const rawQuery = query.trim().toLowerCase();
  if (!rawQuery) {
    return filtered;
  }

  // Tokenize user query
  const tokens = rawQuery.split(/\s+/).filter(Boolean);

  // Extract pack size hints like "2kg", "500g", "1l", "5kg"
  const packTokens = tokens.filter((t) => /\d+(kg|g|l|ml|pc|pcs)/.test(t));

  // Expand with synonyms
  const expandedTokens = new Set<string>();
  tokens.forEach((token) => {
    expandedTokens.add(token);
    if (SYNONYMS[token]) {
      SYNONYMS[token].forEach((syn) => expandedTokens.add(syn));
    }
  });

  const scored: SearchResult[] = [];

  for (const product of filtered) {
    let score = 0;
    const matchedFields: string[] = [];
    const prodName = product.name.toLowerCase();
    const prodBrand = product.brand.toLowerCase();
    const prodCategory = product.category.toLowerCase();
    const prodSubCat = product.subCategory.toLowerCase();
    const prodPack = product.packSize.toLowerCase();
    const prodTags = product.tags.map((t) => t.toLowerCase());

    // 1. Exact full query match in title
    if (prodName.includes(rawQuery)) {
      score += 100;
      matchedFields.push('title_exact');
    }

    // 2. Exact brand match
    if (prodBrand === rawQuery || prodBrand.includes(rawQuery)) {
      score += 80;
      matchedFields.push('brand');
    }

    // 3. Check pack size tokens (e.g. "2kg" matches "2 kg")
    if (packTokens.length > 0) {
      for (const pt of packTokens) {
        const cleanPt = pt.replace(/\s+/g, '');
        const cleanProdPack = prodPack.replace(/\s+/g, '');
        if (cleanProdPack.includes(cleanPt)) {
          score += 50;
          matchedFields.push('pack_size');
        }
      }
    }

    // 4. Token matches (direct & synonyms)
    for (const token of expandedTokens) {
      if (prodBrand.includes(token)) {
        score += 30;
      }
      if (prodName.includes(token)) {
        score += 25;
      }
      if (prodCategory.includes(token) || prodSubCat.includes(token)) {
        score += 15;
      }
      if (prodTags.some((t) => t.includes(token))) {
        score += 20;
      }
      // Typo tolerance if score is low
      if (score === 0 && isFuzzyMatch(token, prodName, token.length > 4 ? 2 : 1)) {
        score += 15;
        matchedFields.push('fuzzy_title');
      }
    }

    if (score > 0) {
      // Prioritize fast movers and in-stock items
      if (product.isFastMover) score += 5;
      if (product.stockQuantity > product.reservedQuantity) score += 5;

      scored.push({ product, relevanceScore: score, matchedFields });
    }
  }

  // Sort descending by relevance score
  scored.sort((a, b) => b.relevanceScore - a.relevanceScore);
  return scored.map((s) => s.product);
}
