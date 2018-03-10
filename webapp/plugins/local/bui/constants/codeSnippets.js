export const h1Code = `import { Header } from '@bpanel/bpanel-ui';

<Header type="h1">H1 tag</Header>
`;

export const h2Code = `import { Header } from '@bpanel/bpanel-ui';

<Header type="h2">H2 tag</Header>
`;

export const h3Code = `import { Header } from '@bpanel/bpanel-ui';

<Header type="h3">H3 tag</Header>
`;

export const h4Code = `import { Header } from '@bpanel/bpanel-ui';

<Header type="h4">H4 tag</Header>
`;

export const h5Code = `import { Header } from '@bpanel/bpanel-ui';

<Header type="h5">H5 tag</Header>
`;

export const h6Code = `import { Header } from '@bpanel/bpanel-ui';

<Header type="h6">H6 tag</Header>
`;

export const spanCode1 = `import { Text } from '@bpanel/bpanel-ui';

<Text>Text span Component</Text>
`;

export const spanCode2 = `import { Text } from '@bpanel/bpanel-ui';

<Text type="span">Text span Component</Text>
`;

export const pCode = `import { Text } from '@bpanel/bpanel-ui';

<Text type="p">Text p Component</Text>
`;

export const strongCode = `import { Text } from '@bpanel/bpanel-ui';

<Text type="strong">Text strong Component</Text>
`;

export const linkCode = `import { Link } from '@bpanel/bpanel-ui';

<Link to="/wallets">Link Component.</Link>
`;

export const externalLinkCode = `import { Link } from '@bpanel/bpanel-ui';

<Link to="http://bcoin.io/">External Link to Bcoin.</Link>
`;

export const buttonPrimaryCode = `import { Button } from '@bpanel/bpanel-ui';

<Button type="primary">Primary Button Component</Button>
`;

export const buttonActionCode = `import { Button } from '@bpanel/bpanel-ui';

<Button type="action">Action Button Component</Button>
`;

export const loginFormCode = `import { Input } from '@bpanel/bpanel-ui';

<form>
  <Input
    type="text"
    name="text"
    placeholder="Text Input"
    style={{ marginBottom: '5px' }}
  />
  <Input
    type="password"
    name="password"
    placeholder="Add your password"
    style={{ marginBottom: '5px' }}
  />
  <Input
    type="submit"
    name="submit"
    value="Submit"
    style={{ marginBottom: '5px', marginRight: '5px' }}
  />
  <Input
    type="reset"
    name="reset"
    value="Reset"
    style={{ marginBottom: '5px', marginRight: '5px' }}
  />
</form>`;

export const radioFormCode = `import { Input } from '@bpanel/bpanel-ui';

<form>
  <Input type="radio" name="radio" value="yes" checked /> Yes<br />
  <Input type="radio" name="radio" value="no" /> No<br />
  <Input type="radio" name="radio" value="maybe" /> Maybe<br />
</form>`;

export const fileUploadCode = `import { Input } from '@bpanel/bpanel-ui';

<form>
  Upload a file<br />
  <Input type="file" name="file" />
</form>`;

export const tableCode = `import { Table } from '@bpanel/bpanel-ui';

<Table {...tableProps} />
`;

export const tabMenuCode = `import { TabMenu } from '@bpanel/bpanel-ui';

<TabMenu />
`;
