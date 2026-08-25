import { readFileSync, writeFileSync } from 'fs';

let content = readFileSync('d:/keshav/project for d/voltcraft-app/src/pages/management/ReportsPage.jsx', 'utf8');

// Add the rendering for AREA_WISE_STAFF report type
// Exact format: </table>\n        </div>\n\n      </div>\n\n    </div>\n  );\n}
const oldEnding = "</table>\n        </div>\n\n      </div>\n\n    </div>\n  );\n}";

const newEnding = "</table>\n        </div>\n        {reportType === 'AREA_WISE_STAFF' && (\n          <AreaWiseStaffReport />\n        )}\n\n      </div>\n\n    </div>\n  );\n}";

content = content.replace(oldEnding, newEnding);

writeFileSync('d:/keshav/project for d/voltcraft-app/src/pages/management/ReportsPage.jsx', content, 'utf8');
console.log('Done');