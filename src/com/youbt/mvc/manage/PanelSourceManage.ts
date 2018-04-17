module rf{
    export class PanelSourceManage{
        protected all_res:object;

        constructor()
        {
            this.all_res = {};
        }

        load(url:string, uri:string):PanelSource
        {
            let res:PanelSource = this.getres(url, uri);
            return res;
        }

        getres(url:string, uri:string):PanelSource
		{
            const {all_res} = this;
			let res:PanelSource = all_res[uri];
			if (!res)
			{
				var index:number = url.lastIndexOf(".");
				if (index == -1)
					return undefined;
				all_res[uri]=res;
			}
			return res;
		}
    }
}