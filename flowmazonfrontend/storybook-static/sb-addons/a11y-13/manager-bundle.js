try {
  (() => {
    var o = __REACT__,
      {
        Children: Sr,
        Component: _r,
        Fragment: G,
        Profiler: Tr,
        PureComponent: se,
        StrictMode: br,
        Suspense: yr,
        __SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED: Or,
        cloneElement: U,
        createContext: ue,
        createElement: h,
        createFactory: Cr,
        createRef: de,
        forwardRef: vr,
        isValidElement: me,
        lazy: Ar,
        memo: xr,
        startTransition: kr,
        unstable_act: Nr,
        useCallback: C,
        useContext: pe,
        useDebugValue: Dr,
        useDeferredValue: wr,
        useEffect: H,
        useId: Lr,
        useImperativeHandle: Pr,
        useInsertionEffect: Hr,
        useLayoutEffect: ge,
        useMemo: F,
        useReducer: Br,
        useRef: W,
        useState: N,
        useSyncExternalStore: Mr,
        useTransition: Gr,
        version: Ur,
      } = __REACT__;
    var Yr = __STORYBOOK_API__,
      {
        ActiveTabs: jr,
        Consumer: zr,
        ManagerContext: Vr,
        Provider: Kr,
        RequestResponseError: qr,
        addons: $,
        combineParameters: Qr,
        controlOrMetaKey: Xr,
        controlOrMetaSymbol: Zr,
        eventMatchesShortcut: Jr,
        eventToShortcut: eo,
        experimental_requestResponse: to,
        isMacLike: no,
        isShortcutTaken: ro,
        keyToSymbol: oo,
        merge: ao,
        mockChannel: io,
        optionOrAltSymbol: co,
        shortcutMatchesShortcut: lo,
        shortcutToHumanString: so,
        types: K,
        useAddonState: q,
        useArgTypes: uo,
        useArgs: mo,
        useChannel: Q,
        useGlobalTypes: po,
        useGlobals: go,
        useParameter: he,
        useSharedState: ho,
        useStoryPrepared: Io,
        useStorybookApi: X,
        useStorybookState: Ie,
      } = __STORYBOOK_API__;
    var _o = __STORYBOOK_COMPONENTS__,
      {
        A: To,
        ActionBar: Z,
        AddonPanel: bo,
        Badge: J,
        Bar: yo,
        Blockquote: Oo,
        Button: Co,
        ClipboardCode: vo,
        Code: Ao,
        DL: xo,
        Div: ko,
        DocumentWrapper: No,
        EmptyTabContent: Ee,
        ErrorFormatter: Do,
        FlexBar: wo,
        Form: Lo,
        H1: Po,
        H2: Ho,
        H3: Bo,
        H4: Mo,
        H5: Go,
        H6: Uo,
        HR: Fo,
        IconButton: fe,
        IconButtonSkeleton: Wo,
        Icons: $o,
        Img: Yo,
        LI: jo,
        Link: zo,
        ListItem: Vo,
        Loader: Ko,
        Modal: qo,
        OL: Qo,
        P: Xo,
        Placeholder: Zo,
        Pre: Jo,
        ResetWrapper: ea,
        ScrollArea: Re,
        Separator: ta,
        Spaced: Se,
        Span: na,
        StorybookIcon: ra,
        StorybookLogo: oa,
        Symbols: aa,
        SyntaxHighlighter: ia,
        TT: ca,
        TabBar: la,
        TabButton: sa,
        TabWrapper: ua,
        Table: da,
        Tabs: ma,
        TabsState: pa,
        TooltipLinkList: _e,
        TooltipMessage: ga,
        TooltipNote: ha,
        UL: Ia,
        WithTooltip: Te,
        WithTooltipPure: Ea,
        Zoom: fa,
        codeCommon: Ra,
        components: Sa,
        createCopyToClipboardFunction: _a,
        getStoryHref: Ta,
        icons: ba,
        interleaveSeparators: ya,
        nameSpaceClassNames: Oa,
        resetComponents: Ca,
        withReset: va,
      } = __STORYBOOK_COMPONENTS__;
    var Da = __STORYBOOK_THEMING__,
      {
        CacheProvider: wa,
        ClassNames: La,
        Global: be,
        ThemeProvider: Pa,
        background: Ha,
        color: Ba,
        convert: Y,
        create: Ma,
        createCache: Ga,
        createGlobal: Ua,
        createReset: Fa,
        css: Wa,
        darken: $a,
        ensure: Ya,
        ignoreSsrWarning: ja,
        isPropValid: za,
        jsx: Va,
        keyframes: Ka,
        lighten: qa,
        styled: l,
        themes: j,
        typography: Qa,
        useTheme: Xa,
        withTheme: Za,
      } = __STORYBOOK_THEMING__;
    var ri = __STORYBOOK_ICONS__,
      {
        AccessibilityAltIcon: oi,
        AccessibilityIcon: ye,
        AddIcon: ai,
        AdminIcon: ii,
        AlertAltIcon: ci,
        AlertIcon: li,
        AlignLeftIcon: si,
        AlignRightIcon: ui,
        AppleIcon: di,
        ArrowDownIcon: mi,
        ArrowLeftIcon: pi,
        ArrowRightIcon: gi,
        ArrowSolidDownIcon: hi,
        ArrowSolidLeftIcon: Ii,
        ArrowSolidRightIcon: Ei,
        ArrowSolidUpIcon: fi,
        ArrowUpIcon: Ri,
        AzureDevOpsIcon: Si,
        BackIcon: _i,
        BasketIcon: Ti,
        BatchAcceptIcon: bi,
        BatchDenyIcon: yi,
        BeakerIcon: Oi,
        BellIcon: Ci,
        BitbucketIcon: vi,
        BoldIcon: Ai,
        BookIcon: xi,
        BookmarkHollowIcon: ki,
        BookmarkIcon: Ni,
        BottomBarIcon: Di,
        BottomBarToggleIcon: wi,
        BoxIcon: Li,
        BranchIcon: Pi,
        BrowserIcon: Hi,
        ButtonIcon: Bi,
        CPUIcon: Mi,
        CalendarIcon: Gi,
        CameraIcon: Ui,
        CategoryIcon: Fi,
        CertificateIcon: Wi,
        ChangedIcon: $i,
        ChatIcon: Yi,
        CheckIcon: Oe,
        ChevronDownIcon: ji,
        ChevronLeftIcon: zi,
        ChevronRightIcon: Vi,
        ChevronSmallDownIcon: Ce,
        ChevronSmallLeftIcon: Ki,
        ChevronSmallRightIcon: qi,
        ChevronSmallUpIcon: Qi,
        ChevronUpIcon: Xi,
        ChromaticIcon: Zi,
        ChromeIcon: Ji,
        CircleHollowIcon: ec,
        CircleIcon: tc,
        ClearIcon: nc,
        CloseAltIcon: rc,
        CloseIcon: oc,
        CloudHollowIcon: ac,
        CloudIcon: ic,
        CogIcon: cc,
        CollapseIcon: lc,
        CommandIcon: sc,
        CommentAddIcon: uc,
        CommentIcon: dc,
        CommentsIcon: mc,
        CommitIcon: pc,
        CompassIcon: gc,
        ComponentDrivenIcon: hc,
        ComponentIcon: Ic,
        ContrastIcon: Ec,
        ControlsIcon: fc,
        CopyIcon: Rc,
        CreditIcon: Sc,
        CrossIcon: _c,
        DashboardIcon: Tc,
        DatabaseIcon: bc,
        DeleteIcon: yc,
        DiamondIcon: Oc,
        DirectionIcon: Cc,
        DiscordIcon: vc,
        DocChartIcon: Ac,
        DocListIcon: xc,
        DocumentIcon: kc,
        DownloadIcon: Nc,
        DragIcon: Dc,
        EditIcon: wc,
        EllipsisIcon: Lc,
        EmailIcon: Pc,
        ExpandAltIcon: Hc,
        ExpandIcon: Bc,
        EyeCloseIcon: Mc,
        EyeIcon: Gc,
        FaceHappyIcon: Uc,
        FaceNeutralIcon: Fc,
        FaceSadIcon: Wc,
        FacebookIcon: $c,
        FailedIcon: Yc,
        FastForwardIcon: jc,
        FigmaIcon: zc,
        FilterIcon: Vc,
        FlagIcon: Kc,
        FolderIcon: qc,
        FormIcon: Qc,
        GDriveIcon: Xc,
        GithubIcon: Zc,
        GitlabIcon: Jc,
        GlobeIcon: el,
        GoogleIcon: tl,
        GraphBarIcon: nl,
        GraphLineIcon: rl,
        GraphqlIcon: ol,
        GridAltIcon: al,
        GridIcon: il,
        GrowIcon: cl,
        HeartHollowIcon: ll,
        HeartIcon: sl,
        HomeIcon: ul,
        HourglassIcon: dl,
        InfoIcon: ml,
        ItalicIcon: pl,
        JumpToIcon: gl,
        KeyIcon: hl,
        LightningIcon: Il,
        LightningOffIcon: El,
        LinkBrokenIcon: fl,
        LinkIcon: Rl,
        LinkedinIcon: Sl,
        LinuxIcon: _l,
        ListOrderedIcon: Tl,
        ListUnorderedIcon: bl,
        LocationIcon: yl,
        LockIcon: Ol,
        MarkdownIcon: Cl,
        MarkupIcon: vl,
        MediumIcon: Al,
        MemoryIcon: xl,
        MenuIcon: kl,
        MergeIcon: Nl,
        MirrorIcon: Dl,
        MobileIcon: wl,
        MoonIcon: Ll,
        NutIcon: Pl,
        OutboxIcon: Hl,
        OutlineIcon: Bl,
        PaintBrushIcon: Ml,
        PaperClipIcon: Gl,
        ParagraphIcon: Ul,
        PassedIcon: Fl,
        PhoneIcon: Wl,
        PhotoDragIcon: $l,
        PhotoIcon: Yl,
        PinAltIcon: jl,
        PinIcon: zl,
        PlayBackIcon: Vl,
        PlayIcon: Kl,
        PlayNextIcon: ql,
        PlusIcon: Ql,
        PointerDefaultIcon: Xl,
        PointerHandIcon: Zl,
        PowerIcon: Jl,
        PrintIcon: es,
        ProceedIcon: ts,
        ProfileIcon: ns,
        PullRequestIcon: rs,
        QuestionIcon: os,
        RSSIcon: as,
        RedirectIcon: is,
        ReduxIcon: cs,
        RefreshIcon: ls,
        ReplyIcon: ss,
        RepoIcon: us,
        RequestChangeIcon: ds,
        RewindIcon: ms,
        RulerIcon: ps,
        SearchIcon: gs,
        ShareAltIcon: hs,
        ShareIcon: Is,
        ShieldIcon: Es,
        SideBySideIcon: fs,
        SidebarAltIcon: Rs,
        SidebarAltToggleIcon: Ss,
        SidebarIcon: _s,
        SidebarToggleIcon: Ts,
        SpeakerIcon: bs,
        StackedIcon: ys,
        StarHollowIcon: Os,
        StarIcon: Cs,
        StickerIcon: vs,
        StopAltIcon: As,
        StopIcon: xs,
        StorybookIcon: ks,
        StructureIcon: Ns,
        SubtractIcon: Ds,
        SunIcon: ws,
        SupportIcon: Ls,
        SwitchAltIcon: Ps,
        SyncIcon: ve,
        TabletIcon: Hs,
        ThumbsUpIcon: Bs,
        TimeIcon: Ms,
        TimerIcon: Gs,
        TransferIcon: Us,
        TrashIcon: Fs,
        TwitterIcon: Ws,
        TypeIcon: $s,
        UbuntuIcon: Ys,
        UndoIcon: js,
        UnfoldIcon: zs,
        UnlockIcon: Vs,
        UnpinIcon: Ks,
        UploadIcon: qs,
        UserAddIcon: Qs,
        UserAltIcon: Xs,
        UserIcon: Zs,
        UsersIcon: Js,
        VSCodeIcon: eu,
        VerifiedIcon: tu,
        VideoIcon: nu,
        WandIcon: ru,
        WatchIcon: ou,
        WindowsIcon: au,
        WrenchIcon: iu,
        YoutubeIcon: cu,
        ZoomIcon: lu,
        ZoomOutIcon: su,
        ZoomResetIcon: uu,
        iconList: du,
      } = __STORYBOOK_ICONS__;
    var Iu = __REACT_DOM__,
      {
        __SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED: Eu,
        createPortal: fu,
        createRoot: Ru,
        findDOMNode: Ae,
        flushSync: Su,
        hydrate: _u,
        hydrateRoot: Tu,
        render: bu,
        unmountComponentAtNode: yu,
        unstable_batchedUpdates: Ou,
        unstable_renderSubtreeIntoContainer: Cu,
        version: vu,
      } = __REACT_DOM__;
    var Du = __STORYBOOK_CORE_EVENTS__,
      {
        ARGTYPES_INFO_REQUEST: wu,
        ARGTYPES_INFO_RESPONSE: Lu,
        CHANNEL_CREATED: Pu,
        CHANNEL_WS_DISCONNECT: Hu,
        CONFIG_ERROR: Bu,
        CREATE_NEW_STORYFILE_REQUEST: Mu,
        CREATE_NEW_STORYFILE_RESPONSE: Gu,
        CURRENT_STORY_WAS_SET: Uu,
        DOCS_PREPARED: Fu,
        DOCS_RENDERED: Wu,
        FILE_COMPONENT_SEARCH_REQUEST: $u,
        FILE_COMPONENT_SEARCH_RESPONSE: Yu,
        FORCE_REMOUNT: ju,
        FORCE_RE_RENDER: zu,
        GLOBALS_UPDATED: Vu,
        NAVIGATE_URL: Ku,
        PLAY_FUNCTION_THREW_EXCEPTION: qu,
        PRELOAD_ENTRIES: Qu,
        PREVIEW_BUILDER_PROGRESS: Xu,
        PREVIEW_KEYDOWN: Zu,
        REGISTER_SUBSCRIPTION: Ju,
        REQUEST_WHATS_NEW_DATA: ed,
        RESET_STORY_ARGS: td,
        RESULT_WHATS_NEW_DATA: nd,
        SAVE_STORY_REQUEST: rd,
        SAVE_STORY_RESPONSE: od,
        SELECT_STORY: ad,
        SET_CONFIG: id,
        SET_CURRENT_STORY: cd,
        SET_GLOBALS: ld,
        SET_INDEX: sd,
        SET_STORIES: ud,
        SET_WHATS_NEW_CACHE: dd,
        SHARED_STATE_CHANGED: md,
        SHARED_STATE_SET: pd,
        STORIES_COLLAPSE_ALL: gd,
        STORIES_EXPAND_ALL: hd,
        STORY_ARGS_UPDATED: Id,
        STORY_CHANGED: xe,
        STORY_ERRORED: Ed,
        STORY_INDEX_INVALIDATED: fd,
        STORY_MISSING: Rd,
        STORY_PREPARED: Sd,
        STORY_RENDERED: ke,
        STORY_RENDER_PHASE_CHANGED: _d,
        STORY_SPECIFIED: Td,
        STORY_THREW_EXCEPTION: bd,
        STORY_UNCHANGED: yd,
        TELEMETRY_ERROR: Od,
        TOGGLE_WHATS_NEW_NOTIFICATIONS: Cd,
        UNHANDLED_ERRORS_WHILE_PLAYING: vd,
        UPDATE_GLOBALS: Ad,
        UPDATE_QUERY_PARAMS: xd,
        UPDATE_STORY_ARGS: kd,
      } = __STORYBOOK_CORE_EVENTS__;
    var Ne = 'storybook/highlight',
      De = `${Ne}/add`,
      Pd = `${Ne}/reset`;
    var k = 'storybook/a11y',
      we = `${k}/panel`,
      nt = 'a11y',
      rt = `${k}/result`,
      ot = `${k}/request`,
      at = `${k}/running`,
      it = `${k}/error`,
      ct = `${k}/manual`,
      M = { RESULT: rt, REQUEST: ot, RUNNING: at, ERROR: it, MANUAL: ct },
      lt = (e) =>
        h(
          'svg',
          { ...e },
          h(
            'defs',
            null,
            h(
              'filter',
              { id: 'protanopia' },
              h('feColorMatrix', {
                in: 'SourceGraphic',
                type: 'matrix',
                values:
                  '0.567, 0.433, 0, 0, 0 0.558, 0.442, 0, 0, 0 0, 0.242, 0.758, 0, 0 0, 0, 0, 1, 0',
              }),
            ),
            h(
              'filter',
              { id: 'protanomaly' },
              h('feColorMatrix', {
                in: 'SourceGraphic',
                type: 'matrix',
                values:
                  '0.817, 0.183, 0, 0, 0 0.333, 0.667, 0, 0, 0 0, 0.125, 0.875, 0, 0 0, 0, 0, 1, 0',
              }),
            ),
            h(
              'filter',
              { id: 'deuteranopia' },
              h('feColorMatrix', {
                in: 'SourceGraphic',
                type: 'matrix',
                values:
                  '0.625, 0.375, 0, 0, 0 0.7, 0.3, 0, 0, 0 0, 0.3, 0.7, 0, 0 0, 0, 0, 1, 0',
              }),
            ),
            h(
              'filter',
              { id: 'deuteranomaly' },
              h('feColorMatrix', {
                in: 'SourceGraphic',
                type: 'matrix',
                values:
                  '0.8, 0.2, 0, 0, 0 0.258, 0.742, 0, 0, 0 0, 0.142, 0.858, 0, 0 0, 0, 0, 1, 0',
              }),
            ),
            h(
              'filter',
              { id: 'tritanopia' },
              h('feColorMatrix', {
                in: 'SourceGraphic',
                type: 'matrix',
                values:
                  '0.95, 0.05,  0, 0, 0 0,  0.433, 0.567, 0, 0 0,  0.475, 0.525, 0, 0 0,  0, 0, 1, 0',
              }),
            ),
            h(
              'filter',
              { id: 'tritanomaly' },
              h('feColorMatrix', {
                in: 'SourceGraphic',
                type: 'matrix',
                values:
                  '0.967, 0.033, 0, 0, 0 0, 0.733, 0.267, 0, 0 0, 0.183, 0.817, 0, 0 0, 0, 0, 1, 0',
              }),
            ),
            h(
              'filter',
              { id: 'achromatopsia' },
              h('feColorMatrix', {
                in: 'SourceGraphic',
                type: 'matrix',
                values:
                  '0.299, 0.587, 0.114, 0, 0 0.299, 0.587, 0.114, 0, 0 0.299, 0.587, 0.114, 0, 0 0, 0, 0, 1, 0',
              }),
            ),
          ),
        ),
      st = 'storybook-preview-iframe',
      ut = [
        { name: 'blurred vision', percentage: 22.9 },
        { name: 'deuteranomaly', percentage: 2.7 },
        { name: 'deuteranopia', percentage: 0.56 },
        { name: 'protanomaly', percentage: 0.66 },
        { name: 'protanopia', percentage: 0.59 },
        { name: 'tritanomaly', percentage: 0.01 },
        { name: 'tritanopia', percentage: 0.016 },
        { name: 'achromatopsia', percentage: 1e-4 },
        { name: 'grayscale' },
      ],
      $e = (e) =>
        e
          ? e === 'blurred vision'
            ? 'blur(2px)'
            : e === 'grayscale'
              ? 'grayscale(100%)'
              : `url('#${e}')`
          : 'none',
      dt = l.div(() => ({
        '&, & svg': { position: 'absolute', width: 0, height: 0 },
      })),
      mt = l.span(
        {
          background:
            'linear-gradient(to right, #F44336, #FF9800, #FFEB3B, #8BC34A, #2196F3, #9C27B0)',
          borderRadius: '1rem',
          display: 'block',
          height: '1rem',
          width: '1rem',
        },
        ({ filter: e }) => ({ filter: $e(e) }),
        ({ theme: e }) => ({
          boxShadow: `${e.appBorderColor} 0 0 0 1px inset`,
        }),
      ),
      pt = l.span({ display: 'flex', flexDirection: 'column' }),
      gt = l.span({ textTransform: 'capitalize' }),
      ht = l.span(({ theme: e }) => ({
        fontSize: 11,
        color: e.textMutedColor,
      })),
      It = (e, n) => [
        ...(e !== null
          ? [
              {
                id: 'reset',
                title: 'Reset color filter',
                onClick: () => {
                  n(null);
                },
                right: void 0,
                active: !1,
              },
            ]
          : []),
        ...ut.map((r) => {
          let t =
            r.percentage !== void 0 ? `${r.percentage}% of users` : void 0;
          return {
            id: r.name,
            title: o.createElement(
              pt,
              null,
              o.createElement(gt, null, r.name),
              t && o.createElement(ht, null, t),
            ),
            onClick: () => {
              n(r);
            },
            right: o.createElement(mt, { filter: r.name }),
            active: e === r,
          };
        }),
      ],
      Et = () => {
        let [e, n] = N(null);
        return o.createElement(
          o.Fragment,
          null,
          e &&
            o.createElement(be, {
              styles: { [`#${st}`]: { filter: $e(e.name) } },
            }),
          o.createElement(
            Te,
            {
              placement: 'top',
              tooltip: ({ onHide: r }) => {
                let t = It(e, (a) => {
                  n(a), r();
                });
                return o.createElement(_e, { links: t });
              },
              closeOnOutsideClick: !0,
              onDoubleClick: () => n(null),
            },
            o.createElement(
              fe,
              { key: 'filter', active: !!e, title: 'Vision simulator' },
              o.createElement(ye, null),
            ),
          ),
          o.createElement(dt, null, o.createElement(lt, null)),
        );
      },
      ft = l.div({ padding: 12, marginBottom: 10 }),
      Rt = l.p({ margin: '0 0 12px' }),
      St = l.a({
        marginTop: 12,
        textDecoration: 'underline',
        color: 'inherit',
        display: 'block',
      }),
      _t = ({ item: e }) =>
        o.createElement(
          ft,
          null,
          o.createElement(Rt, null, e.description),
          o.createElement(
            St,
            { href: e.helpUrl, target: '_blank' },
            'More info...',
          ),
        ),
      ne = function (e, n) {
        return (
          (ne =
            Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array &&
              function (r, t) {
                r.__proto__ = t;
              }) ||
            function (r, t) {
              for (var a in t)
                Object.prototype.hasOwnProperty.call(t, a) && (r[a] = t[a]);
            }),
          ne(e, n)
        );
      };
    function Tt(e, n) {
      if (typeof n != 'function' && n !== null)
        throw new TypeError(
          'Class extends value ' + String(n) + ' is not a constructor or null',
        );
      ne(e, n);
      function r() {
        this.constructor = e;
      }
      e.prototype =
        n === null ? Object.create(n) : ((r.prototype = n.prototype), new r());
    }
    var re = function () {
      return (
        (re =
          Object.assign ||
          function (e) {
            for (var n, r = 1, t = arguments.length; r < t; r++) {
              n = arguments[r];
              for (var a in n)
                Object.prototype.hasOwnProperty.call(n, a) && (e[a] = n[a]);
            }
            return e;
          }),
        re.apply(this, arguments)
      );
    };
    function bt(e, n) {
      var r = {};
      for (var t in e)
        Object.prototype.hasOwnProperty.call(e, t) &&
          n.indexOf(t) < 0 &&
          (r[t] = e[t]);
      if (e != null && typeof Object.getOwnPropertySymbols == 'function')
        for (var a = 0, t = Object.getOwnPropertySymbols(e); a < t.length; a++)
          n.indexOf(t[a]) < 0 &&
            Object.prototype.propertyIsEnumerable.call(e, t[a]) &&
            (r[t[a]] = e[t[a]]);
      return r;
    }
    var z =
      typeof globalThis < 'u'
        ? globalThis
        : typeof window < 'u' || typeof window < 'u'
          ? window
          : typeof self < 'u'
            ? self
            : {};
    function yt(e) {
      var n = typeof e;
      return e != null && (n == 'object' || n == 'function');
    }
    var ae = yt,
      Ot = typeof z == 'object' && z && z.Object === Object && z,
      Ct = Ot,
      vt = Ct,
      At = typeof self == 'object' && self && self.Object === Object && self,
      xt = vt || At || Function('return this')(),
      Ye = xt,
      kt = Ye,
      Nt = function () {
        return kt.Date.now();
      },
      Dt = Nt,
      wt = /\s/;
    function Lt(e) {
      for (var n = e.length; n-- && wt.test(e.charAt(n)); );
      return n;
    }
    var Pt = Lt,
      Ht = Pt,
      Bt = /^\s+/;
    function Mt(e) {
      return e && e.slice(0, Ht(e) + 1).replace(Bt, '');
    }
    var Gt = Mt,
      Ut = Ye,
      Ft = Ut.Symbol,
      je = Ft,
      Le = je,
      ze = Object.prototype,
      Wt = ze.hasOwnProperty,
      $t = ze.toString,
      B = Le ? Le.toStringTag : void 0;
    function Yt(e) {
      var n = Wt.call(e, B),
        r = e[B];
      try {
        e[B] = void 0;
        var t = !0;
      } catch {}
      var a = $t.call(e);
      return t && (n ? (e[B] = r) : delete e[B]), a;
    }
    var jt = Yt,
      zt = Object.prototype,
      Vt = zt.toString;
    function Kt(e) {
      return Vt.call(e);
    }
    var qt = Kt,
      Pe = je,
      Qt = jt,
      Xt = qt,
      Zt = '[object Null]',
      Jt = '[object Undefined]',
      He = Pe ? Pe.toStringTag : void 0;
    function en(e) {
      return e == null
        ? e === void 0
          ? Jt
          : Zt
        : He && He in Object(e)
          ? Qt(e)
          : Xt(e);
    }
    var tn = en;
    function nn(e) {
      return e != null && typeof e == 'object';
    }
    var rn = nn,
      on = tn,
      an = rn,
      cn = '[object Symbol]';
    function ln(e) {
      return typeof e == 'symbol' || (an(e) && on(e) == cn);
    }
    var sn = ln,
      un = Gt,
      Be = ae,
      dn = sn,
      Me = NaN,
      mn = /^[-+]0x[0-9a-f]+$/i,
      pn = /^0b[01]+$/i,
      gn = /^0o[0-7]+$/i,
      hn = parseInt;
    function In(e) {
      if (typeof e == 'number') return e;
      if (dn(e)) return Me;
      if (Be(e)) {
        var n = typeof e.valueOf == 'function' ? e.valueOf() : e;
        e = Be(n) ? n + '' : n;
      }
      if (typeof e != 'string') return e === 0 ? e : +e;
      e = un(e);
      var r = pn.test(e);
      return r || gn.test(e) ? hn(e.slice(2), r ? 2 : 8) : mn.test(e) ? Me : +e;
    }
    var En = In,
      fn = ae,
      ee = Dt,
      Ge = En,
      Rn = 'Expected a function',
      Sn = Math.max,
      _n = Math.min;
    function Tn(e, n, r) {
      var t,
        a,
        u,
        s,
        i,
        m,
        p = 0,
        d = !1,
        g = !1,
        c = !0;
      if (typeof e != 'function') throw new TypeError(Rn);
      (n = Ge(n) || 0),
        fn(r) &&
          ((d = !!r.leading),
          (g = 'maxWait' in r),
          (u = g ? Sn(Ge(r.maxWait) || 0, n) : u),
          (c = 'trailing' in r ? !!r.trailing : c));
      function f(E) {
        var y = t,
          O = a;
        return (t = a = void 0), (p = E), (s = e.apply(O, y)), s;
      }
      function _(E) {
        return (p = E), (i = setTimeout(I, n)), d ? f(E) : s;
      }
      function T(E) {
        var y = E - m,
          O = E - p,
          P = n - y;
        return g ? _n(P, u - O) : P;
      }
      function R(E) {
        var y = E - m,
          O = E - p;
        return m === void 0 || y >= n || y < 0 || (g && O >= u);
      }
      function I() {
        var E = ee();
        if (R(E)) return S(E);
        i = setTimeout(I, T(E));
      }
      function S(E) {
        return (i = void 0), c && t ? f(E) : ((t = a = void 0), s);
      }
      function b() {
        i !== void 0 && clearTimeout(i), (p = 0), (t = m = a = i = void 0);
      }
      function L() {
        return i === void 0 ? s : S(ee());
      }
      function w() {
        var E = ee(),
          y = R(E);
        if (((t = arguments), (a = this), (m = E), y)) {
          if (i === void 0) return _(m);
          if (g) return clearTimeout(i), (i = setTimeout(I, n)), f(m);
        }
        return i === void 0 && (i = setTimeout(I, n)), s;
      }
      return (w.cancel = b), (w.flush = L), w;
    }
    var Ve = Tn,
      bn = Ve,
      yn = ae,
      On = 'Expected a function';
    function Cn(e, n, r) {
      var t = !0,
        a = !0;
      if (typeof e != 'function') throw new TypeError(On);
      return (
        yn(r) &&
          ((t = 'leading' in r ? !!r.leading : t),
          (a = 'trailing' in r ? !!r.trailing : a)),
        bn(e, n, { leading: t, maxWait: n, trailing: a })
      );
    }
    var vn = Cn,
      Ke = function (e, n, r, t) {
        switch (n) {
          case 'debounce':
            return Ve(e, r, t);
          case 'throttle':
            return vn(e, r, t);
          default:
            return e;
        }
      },
      oe = function (e) {
        return typeof e == 'function';
      },
      D = function () {
        return typeof window > 'u';
      },
      Ue = function (e) {
        return e instanceof Element || e instanceof HTMLDocument;
      },
      qe = function (e, n, r, t) {
        return function (a) {
          var u = a.width,
            s = a.height;
          n(function (i) {
            return (i.width === u && i.height === s) ||
              (i.width === u && !t) ||
              (i.height === s && !r)
              ? i
              : (e && oe(e) && e(u, s), { width: u, height: s });
          });
        };
      };
    (function (e) {
      Tt(n, e);
      function n(r) {
        var t = e.call(this, r) || this;
        (t.cancelHandler = function () {
          t.resizeHandler &&
            t.resizeHandler.cancel &&
            (t.resizeHandler.cancel(), (t.resizeHandler = null));
        }),
          (t.attachObserver = function () {
            var p = t.props,
              d = p.targetRef,
              g = p.observerOptions;
            if (!D()) {
              d && d.current && (t.targetRef.current = d.current);
              var c = t.getElement();
              c &&
                ((t.observableElement && t.observableElement === c) ||
                  ((t.observableElement = c), t.resizeObserver.observe(c, g)));
            }
          }),
          (t.getElement = function () {
            var p = t.props,
              d = p.querySelector,
              g = p.targetDomEl;
            if (D()) return null;
            if (d) return document.querySelector(d);
            if (g && Ue(g)) return g;
            if (t.targetRef && Ue(t.targetRef.current))
              return t.targetRef.current;
            var c = Ae(t);
            if (!c) return null;
            var f = t.getRenderType();
            switch (f) {
              case 'renderProp':
                return c;
              case 'childFunction':
                return c;
              case 'child':
                return c;
              case 'childArray':
                return c;
              default:
                return c.parentElement;
            }
          }),
          (t.createResizeHandler = function (p) {
            var d = t.props,
              g = d.handleWidth,
              c = g === void 0 ? !0 : g,
              f = d.handleHeight,
              _ = f === void 0 ? !0 : f,
              T = d.onResize;
            if (!(!c && !_)) {
              var R = qe(T, t.setState.bind(t), c, _);
              p.forEach(function (I) {
                var S = (I && I.contentRect) || {},
                  b = S.width,
                  L = S.height,
                  w = !t.skipOnMount && !D();
                w && R({ width: b, height: L }), (t.skipOnMount = !1);
              });
            }
          }),
          (t.getRenderType = function () {
            var p = t.props,
              d = p.render,
              g = p.children;
            return oe(d)
              ? 'renderProp'
              : oe(g)
                ? 'childFunction'
                : me(g)
                  ? 'child'
                  : Array.isArray(g)
                    ? 'childArray'
                    : 'parent';
          });
        var a = r.skipOnMount,
          u = r.refreshMode,
          s = r.refreshRate,
          i = s === void 0 ? 1e3 : s,
          m = r.refreshOptions;
        return (
          (t.state = { width: void 0, height: void 0 }),
          (t.skipOnMount = a),
          (t.targetRef = de()),
          (t.observableElement = null),
          D() ||
            ((t.resizeHandler = Ke(t.createResizeHandler, u, i, m)),
            (t.resizeObserver = new window.ResizeObserver(t.resizeHandler))),
          t
        );
      }
      return (
        (n.prototype.componentDidMount = function () {
          this.attachObserver();
        }),
        (n.prototype.componentDidUpdate = function () {
          this.attachObserver();
        }),
        (n.prototype.componentWillUnmount = function () {
          D() ||
            ((this.observableElement = null),
            this.resizeObserver.disconnect(),
            this.cancelHandler());
        }),
        (n.prototype.render = function () {
          var r = this.props,
            t = r.render,
            a = r.children,
            u = r.nodeType,
            s = u === void 0 ? 'div' : u,
            i = this.state,
            m = i.width,
            p = i.height,
            d = { width: m, height: p, targetRef: this.targetRef },
            g = this.getRenderType(),
            c;
          switch (g) {
            case 'renderProp':
              return t && t(d);
            case 'childFunction':
              return (c = a), c(d);
            case 'child':
              if (((c = a), c.type && typeof c.type == 'string')) {
                d.targetRef;
                var f = bt(d, ['targetRef']);
                return U(c, f);
              }
              return U(c, d);
            case 'childArray':
              return (
                (c = a),
                c.map(function (_) {
                  return !!_ && U(_, d);
                })
              );
            default:
              return h(s, null);
          }
        }),
        n
      );
    })(se);
    var An = D() ? H : ge;
    function Qe(e) {
      e === void 0 && (e = {});
      var n = e.skipOnMount,
        r = n === void 0 ? !1 : n,
        t = e.refreshMode,
        a = e.refreshRate,
        u = a === void 0 ? 1e3 : a,
        s = e.refreshOptions,
        i = e.handleWidth,
        m = i === void 0 ? !0 : i,
        p = e.handleHeight,
        d = p === void 0 ? !0 : p,
        g = e.targetRef,
        c = e.observerOptions,
        f = e.onResize,
        _ = W(r),
        T = W(null),
        R = g ?? T,
        I = W(),
        S = N({ width: void 0, height: void 0 }),
        b = S[0],
        L = S[1];
      return (
        An(
          function () {
            if (!D()) {
              var w = qe(f, L, m, d),
                E = function (O) {
                  (!m && !d) ||
                    O.forEach(function (P) {
                      var le = (P && P.contentRect) || {},
                        Ze = le.width,
                        Je = le.height,
                        et = !_.current && !D();
                      et && w({ width: Ze, height: Je }), (_.current = !1);
                    });
                };
              I.current = Ke(E, t, u, s);
              var y = new window.ResizeObserver(I.current);
              return (
                R.current && y.observe(R.current, c),
                function () {
                  y.disconnect();
                  var O = I.current;
                  O && O.cancel && O.cancel();
                }
              );
            }
          },
          [t, u, s, m, d, f, c, R.current],
        ),
        re({ ref: R }, b)
      );
    }
    var xn = l.div({
        display: 'flex',
        flexDirection: 'column',
        paddingBottom: 4,
        paddingRight: 4,
        paddingTop: 4,
        fontWeight: 400,
      }),
      kn = l.div(({ elementWidth: e }) => ({
        flexDirection: e > 407 ? 'row' : 'inherit',
        marginBottom: e > 407 ? 6 : 12,
        display: e > 407 ? 'flex' : 'block',
      })),
      Nn = l(J)({
        padding: '2px 8px',
        marginBottom: 3,
        minWidth: 65,
        maxWidth: 'fit-content',
        width: '100%',
        textAlign: 'center',
      }),
      Dn = l.div({ paddingLeft: 6, paddingRight: 23 }),
      wn = (e) => e.charAt(0).toUpperCase().concat(e.slice(1)),
      Ln = ({ rule: e }) => {
        let { ref: n, width: r } = Qe({
            refreshMode: 'debounce',
            handleHeight: !1,
            handleWidth: !0,
          }),
          t = null;
        switch (e.impact) {
          case 'critical':
            t = 'critical';
            break;
          case 'serious':
            t = 'negative';
            break;
          case 'moderate':
            t = 'warning';
            break;
          case 'minor':
            t = 'neutral';
            break;
        }
        return o.createElement(
          kn,
          { ref: n, elementWidth: r || 0 },
          o.createElement(Nn, { status: t }, wn(e.impact)),
          o.createElement(Dn, null, e.message),
        );
      },
      Pn = ({ rules: e }) =>
        o.createElement(
          xn,
          null,
          e.map((n, r) => o.createElement(Ln, { rule: n, key: r })),
        ),
      Hn = [
        Y(j.light).color.negative,
        Y(j.light).color.positive,
        Y(j.light).color.warning,
      ],
      Xe = ue({
        results: { passes: [], incomplete: [], violations: [] },
        setResults: () => {},
        highlighted: [],
        toggleHighlight: () => {},
        clearHighlights: () => {},
        tab: 0,
        setTab: () => {},
      }),
      Fe = { passes: [], incomplete: [], violations: [] },
      Bn = ({ active: e, ...n }) => {
        let [r, t] = q(k, Fe),
          [a, u] = N(0),
          [s, i] = N([]),
          m = X(),
          p = m.getCurrentStoryData(),
          d = C((R, I) => {
            i((S) => (I ? [...S, ...R] : S.filter((b) => !R.includes(b))));
          }, []),
          g = (R) => {
            T(M.REQUEST, R, m.getParameters(R, 'a11y'));
          },
          c = C(() => i([]), []),
          f = C((R) => {
            c(), u(R);
          }, []),
          _ = C(() => {
            u(0), t(Fe);
          }, []),
          T = Q({ [ke]: g, [xe]: _ });
        return (
          H(() => {
            T(De, { elements: s, color: Hn[a] });
          }, [s, a]),
          H(() => {
            e && p?.type === 'story' ? g(p.id) : c();
          }, [e, c, T, p]),
          e
            ? h(Xe.Provider, {
                value: {
                  results: r,
                  setResults: t,
                  highlighted: s,
                  toggleHighlight: d,
                  clearHighlights: c,
                  tab: a,
                  setTab: f,
                },
                ...n,
              })
            : null
        );
      },
      ie = () => pe(Xe),
      Mn = l.input(({ disabled: e }) => ({
        cursor: e ? 'not-allowed' : 'pointer',
      }));
    function We(e, n) {
      let r = e.filter((t) => n.includes(t.target[0])).length;
      return r === 0 ? 1 : r === e.length ? 0 : 2;
    }
    var Gn = ({ toggleId: e, elementsToHighlight: n = [] }) => {
        let { toggleHighlight: r, highlighted: t } = ie(),
          a = o.useRef(null),
          [u, s] = o.useState(We(n, t));
        o.useEffect(() => {
          let m = We(n, t);
          a.current && (a.current.indeterminate = m === 2), s(m);
        }, [n, t]);
        let i = o.useCallback(() => {
          r(
            n.map((m) => m.target[0]),
            u !== 0,
          );
        }, [n, u, r]);
        return o.createElement(Mn, {
          ref: a,
          id: e,
          type: 'checkbox',
          'aria-label': 'Highlight result',
          disabled: !n.length,
          onChange: i,
          checked: u === 0,
        });
      },
      ce = Gn,
      Un = l.li({ fontWeight: 600 }),
      Fn = l.span(({ theme: e }) => ({
        borderBottom: `1px solid ${e.appBorderColor}`,
        width: '100%',
        display: 'flex',
        paddingBottom: 6,
        marginBottom: 6,
        justifyContent: 'space-between',
      })),
      Wn = l.span({
        fontWeight: 'normal',
        alignSelf: 'center',
        paddingRight: 15,
        input: { margin: 0, display: 'block' },
      }),
      $n = ({ element: e, type: n }) => {
        let { any: r, all: t, none: a } = e,
          u = [...r, ...t, ...a],
          s = `${n}-${e.target[0]}`;
        return o.createElement(
          Un,
          null,
          o.createElement(
            Fn,
            null,
            e.target[0],
            o.createElement(
              Wn,
              null,
              o.createElement(ce, { toggleId: s, elementsToHighlight: [e] }),
            ),
          ),
          o.createElement(Pn, { rules: u }),
        );
      },
      Yn = ({ elements: e, type: n }) =>
        o.createElement(
          'ol',
          null,
          e.map((r, t) => o.createElement($n, { element: r, key: t, type: n })),
        ),
      jn = l.div({ display: 'flex', flexWrap: 'wrap', margin: '12px 0' }),
      zn = l.div(({ theme: e }) => ({
        margin: '0 6px',
        padding: 5,
        border: `1px solid ${e.appBorderColor}`,
        borderRadius: e.appBorderRadius,
      })),
      Vn = ({ tags: e }) =>
        o.createElement(
          jn,
          null,
          e.map((n) => o.createElement(zn, { key: n }, n)),
        ),
      Kn = l.div(({ theme: e }) => ({
        display: 'flex',
        width: '100%',
        borderBottom: `1px solid ${e.appBorderColor}`,
        '&:hover': { background: e.background.hoverable },
      })),
      qn = l(Ce)({
        marginRight: 10,
        transition: 'transform 0.1s ease-in-out',
        verticalAlign: 'inherit',
      }),
      Qn = l.div(({ theme: e }) => ({
        padding: e.layoutMargin,
        paddingLeft: e.layoutMargin - 3,
        lineHeight: '20px',
        background: 'none',
        color: 'inherit',
        textAlign: 'left',
        cursor: 'pointer',
        borderLeft: '3px solid transparent',
        width: '100%',
        '&:focus': {
          outline: '0 none',
          borderLeft: `3px solid ${e.color.secondary}`,
        },
      })),
      Xn = l.span({
        fontWeight: 'normal',
        float: 'right',
        marginRight: 15,
        alignSelf: 'center',
        input: { margin: 0, display: 'block' },
      }),
      Zn = (e) => {
        let [n, r] = N(!1),
          { item: t, type: a } = e,
          u = `${a}-${t.id}`;
        return o.createElement(
          G,
          null,
          o.createElement(
            Kn,
            null,
            o.createElement(
              Qn,
              { onClick: () => r(!n), role: 'button' },
              o.createElement(qn, {
                style: { transform: `rotate(${n ? 0 : -90}deg)` },
              }),
              t.help,
            ),
            o.createElement(
              Xn,
              null,
              o.createElement(ce, {
                toggleId: u,
                elementsToHighlight: t.nodes,
              }),
            ),
          ),
          n
            ? o.createElement(
                G,
                null,
                o.createElement(_t, { item: t, key: 'info' }),
                o.createElement(Yn, {
                  elements: t.nodes,
                  type: a,
                  key: 'elements',
                }),
                o.createElement(Vn, { tags: t.tags, key: 'tags' }),
              )
            : null,
        );
      },
      te = ({ items: e, empty: n, type: r }) =>
        o.createElement(
          G,
          null,
          e && e.length
            ? e.map((t) =>
                o.createElement(Zn, { item: t, key: `${r}:${t.id}`, type: r }),
              )
            : o.createElement(Ee, { title: n }),
        ),
      Jn = l.div({ width: '100%', position: 'relative', minHeight: '100%' }),
      er = l.label(({ theme: e }) => ({
        cursor: 'pointer',
        userSelect: 'none',
        color: e.color.dark,
      })),
      tr = l.div(({ elementWidth: e, theme: n }) => ({
        cursor: 'pointer',
        fontSize: 13,
        lineHeight: '20px',
        padding: e > 450 ? '10px 15px 10px 0' : '10px 0px 10px 15px',
        height: '40px',
        border: 'none',
        marginTop: e > 450 ? -40 : 0,
        float: e > 450 ? 'right' : 'left',
        display: 'flex',
        alignItems: 'center',
        width: e > 450 ? 'auto' : '100%',
        borderBottom: e > 450 ? 'none' : `1px solid ${n.appBorderColor}`,
        input: {
          marginLeft: 10,
          marginRight: 0,
          marginTop: -1,
          marginBottom: 0,
        },
      })),
      nr = l.button(
        ({ theme: e }) => ({
          textDecoration: 'none',
          padding: '10px 15px',
          cursor: 'pointer',
          fontWeight: e.typography.weight.bold,
          fontSize: e.typography.size.s2 - 1,
          lineHeight: 1,
          height: 40,
          border: 'none',
          borderTop: '3px solid transparent',
          borderBottom: '3px solid transparent',
          background: 'transparent',
          '&:focus': {
            outline: '0 none',
            borderBottom: `3px solid ${e.color.secondary}`,
          },
        }),
        ({ active: e, theme: n }) =>
          e
            ? { opacity: 1, borderBottom: `3px solid ${n.color.secondary}` }
            : {},
      ),
      rr = l.div({}),
      or = l.div(({ theme: e }) => ({
        boxShadow: `${e.appBorderColor} 0 -1px 0 0 inset`,
        background: e.background.app,
        display: 'flex',
        justifyContent: 'space-between',
        whiteSpace: 'nowrap',
      }));
    function ar(e) {
      return e.reduce((n, r) => n.concat(r.nodes), []);
    }
    var ir = ({ tabs: e }) => {
        let { ref: n, width: r } = Qe({
            refreshMode: 'debounce',
            handleHeight: !1,
            handleWidth: !0,
          }),
          { tab: t, setTab: a } = ie(),
          u = C(
            (i) => {
              a(parseInt(i.currentTarget.getAttribute('data-index') || '', 10));
            },
            [a],
          ),
          s = `${e[t].type}-global-checkbox`;
        return h(
          Jn,
          { ref: n },
          h(
            or,
            null,
            h(
              rr,
              null,
              e.map((i, m) =>
                h(
                  nr,
                  { key: m, 'data-index': m, active: t === m, onClick: u },
                  i.label,
                ),
              ),
            ),
          ),
          e[t].items.length > 0
            ? h(
                tr,
                { elementWidth: r || 0 },
                h(er, { htmlFor: s }, 'Highlight results'),
                h(ce, { toggleId: s, elementsToHighlight: ar(e[t].items) }),
              )
            : null,
          e[t].panel,
        );
      },
      cr = l(ve)({ marginRight: 4 }),
      lr = l(cr)(({ theme: e }) => ({
        animation: `${e.animation.rotate360} 1s linear infinite;`,
      })),
      sr = l.span(({ theme: e }) => ({ color: e.color.positiveText })),
      ur = l.span(({ theme: e }) => ({ color: e.color.negativeText })),
      dr = l.span(({ theme: e }) => ({ color: e.color.warningText })),
      V = l.span({
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100%',
      }),
      mr = () => {
        let { manual: e } = he('a11y', { manual: !1 }),
          [n, r] = N(e ? 'manual' : 'initial'),
          [t, a] = o.useState(void 0),
          { setResults: u, results: s } = ie(),
          { storyId: i } = Ie(),
          m = X();
        o.useEffect(() => {
          r(e ? 'manual' : 'initial');
        }, [e]);
        let p = (I) => {
            r('ran'),
              u(I),
              setTimeout(() => {
                n === 'ran' && r('ready');
              }, 900);
          },
          d = C(() => {
            r('running');
          }, []),
          g = C((I) => {
            r('error'), a(I);
          }, []),
          c = Q({ [M.RUNNING]: d, [M.RESULT]: p, [M.ERROR]: g }),
          f = C(() => {
            r('running'), c(M.MANUAL, i, m.getParameters(i, 'a11y'));
          }, [i]),
          _ = F(() => [{ title: 'Run test', onClick: f }], [f]),
          T = F(
            () => [
              {
                title:
                  n === 'ready'
                    ? 'Rerun tests'
                    : o.createElement(
                        o.Fragment,
                        null,
                        o.createElement(Oe, null),
                        ' Tests completed',
                      ),
                onClick: f,
              },
            ],
            [n, f],
          ),
          R = F(() => {
            let { passes: I, incomplete: S, violations: b } = s;
            return [
              {
                label: o.createElement(ur, null, b.length, ' Violations'),
                panel: o.createElement(te, {
                  items: b,
                  type: 0,
                  empty: 'No accessibility violations found.',
                }),
                items: b,
                type: 0,
              },
              {
                label: o.createElement(sr, null, I.length, ' Passes'),
                panel: o.createElement(te, {
                  items: I,
                  type: 1,
                  empty: 'No accessibility checks passed.',
                }),
                items: I,
                type: 1,
              },
              {
                label: o.createElement(dr, null, S.length, ' Incomplete'),
                panel: o.createElement(te, {
                  items: S,
                  type: 2,
                  empty: 'No accessibility checks incomplete.',
                }),
                items: S,
                type: 2,
              },
            ];
          }, [s]);
        return o.createElement(
          o.Fragment,
          null,
          n === 'initial' && o.createElement(V, null, 'Initializing...'),
          n === 'manual' &&
            o.createElement(
              o.Fragment,
              null,
              o.createElement(V, null, 'Manually run the accessibility scan.'),
              o.createElement(Z, { key: 'actionbar', actionItems: _ }),
            ),
          n === 'running' &&
            o.createElement(
              V,
              null,
              o.createElement(lr, { size: 12 }),
              ' Please wait while the accessibility scan is running ...',
            ),
          (n === 'ready' || n === 'ran') &&
            o.createElement(
              o.Fragment,
              null,
              o.createElement(
                Re,
                { vertical: !0, horizontal: !0 },
                o.createElement(ir, { key: 'tabs', tabs: R }),
              ),
              o.createElement(Z, { key: 'actionbar', actionItems: T }),
            ),
          n === 'error' &&
            o.createElement(
              V,
              null,
              'The accessibility scan encountered an error.',
              o.createElement('br', null),
              typeof t == 'string' ? t : JSON.stringify(t),
            ),
        );
      },
      pr = () => {
        let [e] = q(k),
          n = e?.violations?.length || 0,
          r = e?.incomplete?.length || 0,
          t = n + r;
        return o.createElement(
          'div',
          null,
          o.createElement(
            Se,
            { col: 1 },
            o.createElement(
              'span',
              { style: { display: 'inline-block', verticalAlign: 'middle' } },
              'Accessibility',
            ),
            t === 0 ? '' : o.createElement(J, { status: 'neutral' }, t),
          ),
        );
      };
    $.register(k, (e) => {
      $.add(we, {
        title: '',
        type: K.TOOL,
        match: ({ viewMode: n, tabId: r }) => n === 'story' && !r,
        render: () => o.createElement(Et, null),
      }),
        $.add(we, {
          title: pr,
          type: K.PANEL,
          render: ({ active: n = !0 }) =>
            o.createElement(Bn, { active: n }, o.createElement(mr, null)),
          paramKey: nt,
        });
    });
  })();
} catch (e) {
  console.error(
    '[Storybook] One of your manager-entries failed: ' + import.meta.url,
    e,
  );
}
